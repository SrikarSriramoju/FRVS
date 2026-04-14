package com.frvs.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "votes")
public class Vote {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    
    private String userId;
    
    private String targetId; // can be featureId or commentId
    
    private String targetType; // "FEATURE" or "COMMENT"
    
    @Enumerated(EnumType.STRING)
    private VoteType voteType;

}
