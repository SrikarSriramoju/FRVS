package com.frvs.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "feature_requests")
public class FeatureRequest {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    
    private String title;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    private String userId;
    private String userName;
    private String userEmail;
    
    private String productKey;
    
    @Enumerated(EnumType.STRING)
    @Builder.Default
    private FeatureStatus status = FeatureStatus.OPEN;
    
    @CreationTimestamp
    private LocalDateTime createdAt;
    
    @Builder.Default
    private int upvotes = 0;
    @Builder.Default
    private int downvotes = 0;
    @Builder.Default
    private int commentCount = 0;

    @Transient
    private String userVote;
    
    // Can be null if it hasn't been clustered yet
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cluster_id")
    private FeatureCluster cluster;
}
