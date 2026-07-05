package com.frvs.backend.service;

import com.frvs.backend.dto.FeatureDto;
import com.frvs.backend.dto.AISimilarityRequest;
import com.frvs.backend.dto.AISimilarityResponse;
import com.frvs.backend.entity.AppUser;
import com.frvs.backend.entity.FeatureCluster;
import com.frvs.backend.entity.FeatureRequest;
import com.frvs.backend.entity.FeatureStatus;
import com.frvs.backend.entity.VoteType;
import com.frvs.backend.entity.Vote;
import com.frvs.backend.repository.FeatureClusterRepository;
import com.frvs.backend.repository.FeatureRequestRepository;
import com.frvs.backend.repository.VoteRepository;

import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class FeatureService {

    private static final Logger log = LoggerFactory.getLogger(FeatureService.class);

    private final FeatureRequestRepository featureRepository;
    private final FeatureClusterRepository clusterRepository;
    private final VoteRepository voteRepository;
    private final AIService aiService;

    public FeatureService(FeatureRequestRepository featureRepository,
                          FeatureClusterRepository clusterRepository,
                          VoteRepository voteRepository,
                          AIService aiService) {
        this.featureRepository = featureRepository;
        this.clusterRepository = clusterRepository;
        this.voteRepository = voteRepository;
        this.aiService = aiService;
    }

    public FeatureRequest createFeature(FeatureDto dto, AppUser currentUser) {
        FeatureRequest feature = FeatureRequest.builder()
                .title(dto.getTitle())
                .description(dto.getDescription())
                .userId(currentUser.getId())
                .userName(currentUser.getName())
                .userEmail(currentUser.getEmail())
                .productKey(currentUser.getProductKey())
                .build();
                
        FeatureRequest saved = featureRepository.save(feature);
        
        // Asynchronously or synchronously cluster it
        clusterFeature(saved);

        FeatureRequest result = featureRepository.findById(saved.getId()).orElse(saved);
        result.setUserVote(null);
        return result;
    }

    private void clusterFeature(FeatureRequest feature) {
        log.info("Starting clustering for featureId={}, title='{}', productKey={}",
                feature.getId(), feature.getTitle(), feature.getProductKey());

        List<FeatureCluster> existingClusters = clusterRepository.findByProductKey(feature.getProductKey());
        if(existingClusters.isEmpty()){
            log.info("No existing clusters found for productKey={}. Creating a new cluster.", feature.getProductKey());
            createNewCluster(feature);
            return;
        }

        AISimilarityRequest request = new AISimilarityRequest();
        request.setNew_feature(feature.getTitle() + ". " + feature.getDescription());
        
        List<AISimilarityRequest.ExistingFeature> list = existingClusters.stream().map(c -> {
            AISimilarityRequest.ExistingFeature ef = new AISimilarityRequest.ExistingFeature();
            ef.setFeature_id(c.getId());
            ef.setTitle(c.getSummarizedTitle());
            return ef;
        }).collect(Collectors.toList());
        request.setExisting_features(list);

        log.info("Calling similarity service for featureId={} with {} candidate clusters", feature.getId(), list.size());

        AISimilarityResponse response = aiService.getSimilarity(request);

        log.info("Similarity service returned {} results for featureId={}",
            response.getResults() == null ? 0 : response.getResults().size(),
            feature.getId());

        if(response.getResults() != null && !response.getResults().isEmpty()) {
            // Find highest score
            AISimilarityResponse.Result bestMatch = response.getResults().stream()
                    .max((a, b) -> Double.compare(a.getScore(), b.getScore()))
                    .orElse(null);

            if(bestMatch != null && bestMatch.getScore() > 0.75) {
                // Attach to existing cluster
                FeatureCluster cluster = clusterRepository.findById(bestMatch.getFeature_id()).orElse(null);
                if(cluster != null) {
                    log.info("Best similarity match found for featureId={} -> clusterId={} score={}",
                            feature.getId(), bestMatch.getFeature_id(), bestMatch.getScore());
                    feature.setCluster(cluster);
                    featureRepository.save(feature);
                    refreshClusterSummary(cluster.getId());
                    return;
                }
            }
        }
        
        log.info("No strong similarity match found for featureId={}. Creating a new cluster.", feature.getId());
        createNewCluster(feature);
    }

    private void createNewCluster(FeatureRequest feature) {
        FeatureCluster cluster = FeatureCluster.builder()
                .productKey(feature.getProductKey())
                .summarizedTitle(feature.getTitle())
                .summarizedDescription("Initial Request: " + feature.getDescription())
                .build();
        FeatureCluster savedCluster = clusterRepository.save(cluster);
        feature.setCluster(savedCluster);
        featureRepository.save(feature);
        refreshClusterSummary(savedCluster.getId());
    }

    private void refreshClusterSummary(String clusterId) {
        if (clusterId == null) {
            return;
        }
        FeatureCluster cluster = clusterRepository.findById(clusterId).orElse(null);
        if (cluster == null) {
            return;
        }

        List<FeatureRequest> clusterFeatures = featureRepository.findByClusterId(clusterId);
        if (clusterFeatures == null || clusterFeatures.isEmpty()) {
            return;
        }

        FeatureRequest representative = clusterFeatures.stream()
                .max(Comparator
                        .comparingInt(FeatureRequest::getUpvotes)
                        .thenComparingInt(FeatureRequest::getCommentCount))
                .orElse(clusterFeatures.get(0));

        cluster.setSummarizedTitle(representative.getTitle());
        cluster.setSummarizedDescription(representative.getDescription());
        if (cluster.getTags() == null) {
            cluster.setTags(new ArrayList<>());
        }
        clusterRepository.save(cluster);
    }

    public List<FeatureRequest> getFeaturesByProductKey(String productKey, AppUser currentUser) {
        List<FeatureRequest> features = featureRepository.findByProductKeyOrderByCreatedAtDesc(productKey);
        features.forEach(feature -> attachUserVote(feature, currentUser.getId()));
        return features;
    }

    public FeatureRequest voteFeature(String featureId, AppUser user, VoteType newVoteType) {
        FeatureRequest feature = featureRepository.findById(featureId)
                .orElseThrow(() -> new RuntimeException("Feature not found"));

        Optional<Vote> existingVoteOpt = voteRepository.findByUserIdAndTargetIdAndTargetType(user.getId(), featureId, "FEATURE");

        if (existingVoteOpt.isPresent()) {
            Vote existingVote = existingVoteOpt.get();
            if (existingVote.getVoteType() == newVoteType) {
                // Cancel vote
                if (newVoteType == VoteType.UPVOTE) feature.setUpvotes(feature.getUpvotes() - 1);
                else feature.setDownvotes(feature.getDownvotes() - 1);
                voteRepository.delete(existingVote);
            } else {
                // Change vote
                if (newVoteType == VoteType.UPVOTE) {
                    feature.setUpvotes(feature.getUpvotes() + 1);
                    feature.setDownvotes(feature.getDownvotes() - 1);
                } else {
                    feature.setDownvotes(feature.getDownvotes() + 1);
                    feature.setUpvotes(feature.getUpvotes() - 1);
                }
                existingVote.setVoteType(newVoteType);
                voteRepository.save(existingVote);
            }
        } else {
            // New vote
            if (newVoteType == VoteType.UPVOTE) feature.setUpvotes(feature.getUpvotes() + 1);
            else feature.setDownvotes(feature.getDownvotes() + 1);

            Vote vote = Vote.builder()
                    .userId(user.getId())
                    .targetId(featureId)
                    .targetType("FEATURE")
                    .voteType(newVoteType)
                    .build();
            voteRepository.save(vote);
        }

        FeatureRequest saved = featureRepository.save(feature);
        if (saved.getCluster() != null) {
            refreshClusterSummary(saved.getCluster().getId());
        }
        attachUserVote(saved, user.getId());
        return saved;
    }

    private void attachUserVote(FeatureRequest feature, String userId) {
        voteRepository.findByUserIdAndTargetIdAndTargetType(userId, feature.getId(), "FEATURE")
                .ifPresentOrElse(
                        vote -> feature.setUserVote(vote.getVoteType().name()),
                        () -> feature.setUserVote(null)
                );
    }

    public void updateStatus(String featureId, FeatureStatus status) {
        FeatureRequest feature = featureRepository.findById(featureId)
                .orElseThrow(() -> new RuntimeException("Feature not found"));
        feature.setStatus(status);
        featureRepository.save(feature);
        if (feature.getCluster() != null) {
            FeatureCluster cluster = feature.getCluster();
            cluster.setStatus(status);
            clusterRepository.save(cluster);
        }
    }
}
