package com.frvs.backend.repository;

import com.frvs.backend.entity.FeatureRequest;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface FeatureRequestRepository extends JpaRepository<FeatureRequest, String> {
    List<FeatureRequest> findByProductKeyOrderByCreatedAtDesc(String productKey);
    List<FeatureRequest> findByUserId(String userId);
    List<FeatureRequest> findByClusterId(String clusterId);

    @Query("select coalesce(sum(fr.upvotes + fr.downvotes), 0) from FeatureRequest fr where fr.productKey = :productKey")
    long sumVotesByProductKey(@Param("productKey") String productKey);
}
