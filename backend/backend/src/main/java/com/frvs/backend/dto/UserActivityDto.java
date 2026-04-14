package com.frvs.backend.dto;

import com.frvs.backend.entity.Comment;
import com.frvs.backend.entity.FeatureRequest;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserActivityDto {
    private List<FeatureRequest> requests;
    private List<Comment> comments;
    private List<FeatureRequest> votedFeatures;
    private List<Comment> votedComments;
}