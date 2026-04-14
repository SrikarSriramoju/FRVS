package com.frvs.backend.service;

import com.frvs.backend.dto.CommentDto;
import com.frvs.backend.dto.AISentimentRequest;
import com.frvs.backend.dto.AISentimentResponse;
import com.frvs.backend.entity.AppUser;
import com.frvs.backend.entity.Comment;
import com.frvs.backend.entity.SentimentLabel;
import com.frvs.backend.entity.SentimentScore;
import com.frvs.backend.entity.VoteType;
import com.frvs.backend.entity.Vote;
import com.frvs.backend.entity.FeatureRequest;
import com.frvs.backend.repository.CommentRepository;
import com.frvs.backend.repository.SentimentScoreRepository;
import com.frvs.backend.repository.VoteRepository;
import com.frvs.backend.repository.FeatureRequestRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CommentService {

    private final CommentRepository commentRepository;
    private final SentimentScoreRepository sentimentRepository;
    private final VoteRepository voteRepository;
    private final FeatureRequestRepository featureRepository;
    private final AIService aiService;

    public CommentService(CommentRepository commentRepository,
                          SentimentScoreRepository sentimentRepository,
                          VoteRepository voteRepository,
                          FeatureRequestRepository featureRepository,
                          AIService aiService) {
        this.commentRepository = commentRepository;
        this.sentimentRepository = sentimentRepository;
        this.voteRepository = voteRepository;
        this.featureRepository = featureRepository;
        this.aiService = aiService;
    }

    public Comment createComment(CommentDto dto, AppUser currentUser) {
        Comment comment = Comment.builder()
                .content(dto.getContent())
                .featureId(dto.getFeatureId())
                .parentId(dto.getParentId())
                .userId(currentUser.getId())
                .userName(currentUser.getName())
                .build();
                
        Comment saved = commentRepository.save(comment);

        // Update count
        FeatureRequest feature = featureRepository.findById(dto.getFeatureId()).orElse(null);
        if (feature != null) {
            feature.setCommentCount(feature.getCommentCount() + 1);
            featureRepository.save(feature);
            
            // Analyze sentiment
            analyzeSentiment(saved, feature);
        }

        return saved;
    }
    
    private void analyzeSentiment(Comment comment, FeatureRequest feature) {
        AISentimentRequest request = new AISentimentRequest();
        request.setComment_id(comment.getId());
        request.setText(comment.getContent());
        
        AISentimentResponse response = aiService.getSentiment(request);

        if (response == null || response.getSentiment() == null) {
            response = new AISentimentResponse();
            response.setSentiment("NEUTRAL");
            response.setConfidence(0.0);
            response.setPositive(0.0);
            response.setNeutral(1.0);
            response.setNegative(0.0);
        }
        
        SentimentScore score = SentimentScore.builder()
            .commentId(comment.getId())
            .clusterId(feature.getCluster() != null ? feature.getCluster().getId() : null)
            .overall(SentimentLabel.valueOf(response.getSentiment().toUpperCase()))
            .confidence(response.getConfidence())
            .positive(response.getPositive())
            .neutral(response.getNeutral())
            .negative(response.getNegative())
            .build();
            
        sentimentRepository.save(score);
    }
    
    public List<Comment> getComments(String featureId, AppUser currentUser) {
        List<Comment> comments = commentRepository.findByFeatureIdOrderByCreatedAtDesc(featureId);
        comments.forEach(comment -> attachUserVote(comment, currentUser.getId()));
        return comments;
    }
    
    public Comment voteComment(String commentId, AppUser user, VoteType newVoteType) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found"));

        Optional<Vote> existingVoteOpt = voteRepository.findByUserIdAndTargetIdAndTargetType(user.getId(), commentId, "COMMENT");

        if (existingVoteOpt.isPresent()) {
            Vote existingVote = existingVoteOpt.get();
            if (existingVote.getVoteType() == newVoteType) {
                // Cancel vote
                if (newVoteType == VoteType.UPVOTE) comment.setUpvotes(comment.getUpvotes() - 1);
                else comment.setDownvotes(comment.getDownvotes() - 1);
                voteRepository.delete(existingVote);
            } else {
                // Change vote
                if (newVoteType == VoteType.UPVOTE) {
                    comment.setUpvotes(comment.getUpvotes() + 1);
                    comment.setDownvotes(comment.getDownvotes() - 1);
                } else {
                    comment.setDownvotes(comment.getDownvotes() + 1);
                    comment.setUpvotes(comment.getUpvotes() - 1);
                }
                existingVote.setVoteType(newVoteType);
                voteRepository.save(existingVote);
            }
        } else {
            // New vote
            if (newVoteType == VoteType.UPVOTE) comment.setUpvotes(comment.getUpvotes() + 1);
            else comment.setDownvotes(comment.getDownvotes() + 1);

            Vote vote = Vote.builder()
                    .userId(user.getId())
                    .targetId(commentId)
                    .targetType("COMMENT")
                    .voteType(newVoteType)
                    .build();
            voteRepository.save(vote);
        }

        Comment saved = commentRepository.save(comment);
        attachUserVote(saved, user.getId());
        return saved;
    }

    private void attachUserVote(Comment comment, String userId) {
        voteRepository.findByUserIdAndTargetIdAndTargetType(userId, comment.getId(), "COMMENT")
                .ifPresentOrElse(
                        vote -> comment.setUserVote(vote.getVoteType().name()),
                        () -> comment.setUserVote(null)
                );
    }
}
