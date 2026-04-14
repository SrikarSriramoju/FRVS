package com.frvs.backend.dto;

import lombok.Data;

@Data
public class AISentimentResponse {
    private String comment_id;
    private String sentiment; // "POSITIVE", "NEUTRAL", "NEGATIVE"
    private double confidence;
    private double positive;
    private double neutral;
    private double negative;
}
