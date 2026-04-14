package com.frvs.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "feature_clusters")
public class FeatureCluster {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    
    private String productKey;
    private String summarizedTitle;
    
    @Column(columnDefinition = "TEXT")
    private String summarizedDescription;
    
    @Enumerated(EnumType.STRING)
    @Builder.Default
    private FeatureStatus status = FeatureStatus.OPEN;
    
    @CreationTimestamp
    private LocalDateTime createdAt;
    
    // Aggregation fields
    @Builder.Default
    private int upvotes = 0;
    @Builder.Default
    private int downvotes = 0;
    
    @ElementCollection
    private List<String> tags;

}
