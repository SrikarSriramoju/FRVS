package com.frvs.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "sentiment_scores")
public class SentimentScore {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    
    private String commentId;
    private String clusterId; // If we want to assign sentiment directly to clusters based on related comments
    
    @Enumerated(EnumType.STRING)
    private SentimentLabel overall;
    
    private double confidence;
    private double positive;
    private double neutral;
    private double negative;

}
