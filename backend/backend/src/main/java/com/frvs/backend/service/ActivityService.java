package com.frvs.backend.service;

import com.frvs.backend.dto.UserActivityDto;
import com.frvs.backend.entity.AppUser;
import com.frvs.backend.entity.Comment;
import com.frvs.backend.entity.FeatureRequest;
import com.frvs.backend.entity.Vote;
import com.frvs.backend.repository.CommentRepository;
import com.frvs.backend.repository.FeatureRequestRepository;
import com.frvs.backend.repository.VoteRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class ActivityService {

    private final FeatureRequestRepository featureRepository;
    private final CommentRepository commentRepository;
    private final VoteRepository voteRepository;

    public ActivityService(FeatureRequestRepository featureRepository,
                           CommentRepository commentRepository,
                           VoteRepository voteRepository) {
        this.featureRepository = featureRepository;
        this.commentRepository = commentRepository;
        this.voteRepository = voteRepository;
    }

    public UserActivityDto getActivity(AppUser user) {
        List<FeatureRequest> requests = featureRepository.findByUserId(user.getId());
        requests.forEach(feature -> attachFeatureVote(user.getId(), feature));

        List<Comment> comments = commentRepository.findByUserId(user.getId());
        comments.forEach(comment -> attachCommentVote(user.getId(), comment));

        List<Vote> featureVotes = voteRepository.findByUserIdAndTargetType(user.getId(), "FEATURE");
        Set<String> votedFeatureIds = featureVotes.stream().map(Vote::getTargetId).collect(Collectors.toSet());
        List<FeatureRequest> votedFeatures = votedFeatureIds.isEmpty()
                ? List.of()
                : featureRepository.findAllById(votedFeatureIds);
        votedFeatures.forEach(feature -> attachFeatureVote(user.getId(), feature));

        List<Vote> commentVotes = voteRepository.findByUserIdAndTargetType(user.getId(), "COMMENT");
        Set<String> votedCommentIds = commentVotes.stream().map(Vote::getTargetId).collect(Collectors.toSet());
        List<Comment> votedComments = votedCommentIds.isEmpty()
                ? List.of()
                : commentRepository.findAllById(votedCommentIds);
        votedComments.forEach(comment -> attachCommentVote(user.getId(), comment));

        return UserActivityDto.builder()
                .requests(requests)
                .comments(comments)
                .votedFeatures(votedFeatures)
                .votedComments(votedComments)
                .build();
    }

    private void attachFeatureVote(String userId, FeatureRequest feature) {
        voteRepository.findByUserIdAndTargetIdAndTargetType(userId, feature.getId(), "FEATURE")
                .ifPresentOrElse(
                        vote -> feature.setUserVote(vote.getVoteType().name()),
                        () -> feature.setUserVote(null)
                );
    }

    private void attachCommentVote(String userId, Comment comment) {
        voteRepository.findByUserIdAndTargetIdAndTargetType(userId, comment.getId(), "COMMENT")
                .ifPresentOrElse(
                        vote -> comment.setUserVote(vote.getVoteType().name()),
                        () -> comment.setUserVote(null)
                );
    }
}