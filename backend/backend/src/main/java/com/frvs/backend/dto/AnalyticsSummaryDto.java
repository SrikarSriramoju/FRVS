package com.frvs.backend.dto;

import lombok.Data;
import lombok.Builder;

@Data
@Builder
public class AnalyticsSummaryDto {
    private long totalFeatures;
    private long totalClusters;
    private long totalVotes;
    private long totalComments;
    private long openFeatures;
    private long todoFeatures;
    private long inProgressFeatures;
    private long completedFeatures;
    private double avgSentimentScore; // For simplicity, 1 to 5, or negative/positive percentage
    private String topRequestedCluster;
}
