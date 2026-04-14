package com.frvs.backend.dto;

import lombok.Data;

@Data
public class CommentDto {
    private String content;
    private String featureId;
    private String parentId;
}
