package com.frvs.backend.repository;

import com.frvs.backend.entity.FeatureCluster;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface FeatureClusterRepository extends JpaRepository<FeatureCluster, String> {
    List<FeatureCluster> findByProductKey(String productKey);
    List<FeatureCluster> findAllByOrderByUpvotesDesc();
}
