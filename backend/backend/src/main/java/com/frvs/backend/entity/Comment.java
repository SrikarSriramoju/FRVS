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
@Table(name = "comments")
public class Comment {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    
    @Column(columnDefinition = "TEXT")
    private String content;
    
    private String userId;
    private String userName;
    
    private String featureId;
    
    // Optional parent for nested comments
    private String parentId;
    
    @CreationTimestamp
    private LocalDateTime createdAt;
    
    @Builder.Default
    private int upvotes = 0;
    @Builder.Default
    private int downvotes = 0;

    @Transient
    private String userVote;

}
