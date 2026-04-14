package com.frvs.backend.dto;

import lombok.Data;

@Data
public class AISentimentRequest {
    private String comment_id;
    private String text;
}
