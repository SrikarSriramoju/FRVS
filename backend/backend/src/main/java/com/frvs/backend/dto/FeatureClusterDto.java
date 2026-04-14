package com.frvs.backend.dto;

import com.frvs.backend.entity.FeatureStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FeatureClusterDto {
    private String id;
    private String summarizedTitle;
    private String summarizedDescription;
    private String productKey;
    private FeatureStatus status;
    private int totalRequests;
    private int upvotes;
    private int downvotes;
    private SentimentScoreDto sentimentScore;
    private List<RawFeatureRequestDto> relatedFeatures;
    private LocalDateTime createdAt;
    private List<String> tags;
}
