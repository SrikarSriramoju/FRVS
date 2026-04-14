package com.frvs.backend.repository;

import com.frvs.backend.entity.SentimentScore;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.List;

public interface SentimentScoreRepository extends JpaRepository<SentimentScore, String> {
    Optional<SentimentScore> findByCommentId(String commentId);
    List<SentimentScore> findByClusterId(String clusterId);
    List<SentimentScore> findByClusterIdIn(List<String> clusterIds);
}
