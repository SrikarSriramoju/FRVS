package com.frvs.backend.repository;

import com.frvs.backend.entity.Comment;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, String> {
    List<Comment> findByFeatureIdOrderByCreatedAtDesc(String featureId);
    List<Comment> findByUserId(String userId);

    long countByFeatureIdIn(List<String> featureIds);

    @Query("select coalesce(sum(c.upvotes + c.downvotes), 0) from Comment c where c.featureId in :featureIds")
    long sumVotesByFeatureIds(@Param("featureIds") List<String> featureIds);
}
