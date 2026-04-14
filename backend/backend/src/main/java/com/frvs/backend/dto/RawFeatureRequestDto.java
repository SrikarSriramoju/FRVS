package com.frvs.backend.dto;

import com.frvs.backend.entity.FeatureStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RawFeatureRequestDto {
    private String id;
    private String title;
    private String description;
    private String userId;
    private String userName;
    private String userEmail;
    private String productKey;
    private LocalDateTime createdAt;
    private int upvotes;
    private int downvotes;
    private int commentCount;
    private FeatureStatus status;
    private String clusterId;
}
