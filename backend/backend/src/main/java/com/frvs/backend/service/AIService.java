package com.frvs.backend.service;

import com.frvs.backend.dto.AISentimentRequest;
import com.frvs.backend.dto.AISentimentResponse;
import com.frvs.backend.dto.AISimilarityRequest;
import com.frvs.backend.dto.AISimilarityResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.time.Duration;
import java.util.Collections;

@Service
public class AIService {

    private final WebClient webClient;

    @Value("${ai.similarity-service.url}")
    private String similarityUrl;

    @Value("${ai.sentiment-service.url}")
    private String sentimentUrl;

    public AIService(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.build();
    }

    public AISimilarityResponse getSimilarity(AISimilarityRequest request) {
        try {
            AISimilarityResponse response = webClient.post()
                    .uri(similarityUrl)
                    .bodyValue(request)
                    .retrieve()
                    .bodyToMono(AISimilarityResponse.class)
                    .timeout(Duration.ofSeconds(5))
                    .block();
            if (response == null) {
                AISimilarityResponse fallback = new AISimilarityResponse();
                fallback.setResults(Collections.emptyList());
                return fallback;
            }
            if (response.getResults() == null) {
                response.setResults(Collections.emptyList());
            }
            return response;
        } catch (Exception e) {
            e.printStackTrace();
            AISimilarityResponse fallback = new AISimilarityResponse();
            fallback.setResults(Collections.emptyList());
            return fallback;
        }
    }

    public AISentimentResponse getSentiment(AISentimentRequest request) {
        try {
            AISentimentResponse response = webClient.post()
                    .uri(sentimentUrl)
                    .bodyValue(request)
                    .retrieve()
                    .bodyToMono(AISentimentResponse.class)
                    .timeout(Duration.ofSeconds(5))
                    .block();
            if (response == null || response.getSentiment() == null) {
                AISentimentResponse fallback = new AISentimentResponse();
                fallback.setSentiment("NEUTRAL");
                fallback.setConfidence(0.0);
                fallback.setPositive(0.0);
                fallback.setNeutral(1.0);
                fallback.setNegative(0.0);
                return fallback;
            }
            return response;
        } catch (Exception e) {
            e.printStackTrace();
            AISentimentResponse fallback = new AISentimentResponse();
            fallback.setSentiment("NEUTRAL");
            fallback.setConfidence(0.0);
            fallback.setPositive(0.0);
            fallback.setNeutral(1.0);
            fallback.setNegative(0.0);
            return fallback;
        }
    }
}
