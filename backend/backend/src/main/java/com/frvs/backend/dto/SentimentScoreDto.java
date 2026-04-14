package com.frvs.backend.dto;

import com.frvs.backend.entity.SentimentLabel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SentimentScoreDto {
    private double positive;
    private double neutral;
    private double negative;
    private SentimentLabel overall;
}
