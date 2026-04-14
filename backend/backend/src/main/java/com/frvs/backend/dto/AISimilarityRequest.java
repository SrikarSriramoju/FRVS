package com.frvs.backend.dto;

import lombok.Data;
import java.util.List;

@Data
public class AISimilarityRequest {
    private String new_feature;
    private List<ExistingFeature> existing_features;

    @Data
    public static class ExistingFeature {
        private String feature_id;
        private String title;
    }
}
