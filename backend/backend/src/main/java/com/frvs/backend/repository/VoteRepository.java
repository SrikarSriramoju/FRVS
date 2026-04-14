package com.frvs.backend.repository;

import com.frvs.backend.entity.Vote;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface VoteRepository extends JpaRepository<Vote, String> {
    Optional<Vote> findByUserIdAndTargetId(String userId, String targetId);
    Optional<Vote> findByUserIdAndTargetIdAndTargetType(String userId, String targetId, String targetType);
    List<Vote> findByUserIdAndTargetType(String userId, String targetType);
}
