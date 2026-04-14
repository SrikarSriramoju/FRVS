package com.frvs.backend.dto;

import lombok.Data;
import java.util.List;

@Data
public class AISimilarityResponse {
    private List<Result> results;

    @Data
    public static class Result {
        private String feature_id;
        private String title;
        private double score;
    }
}
