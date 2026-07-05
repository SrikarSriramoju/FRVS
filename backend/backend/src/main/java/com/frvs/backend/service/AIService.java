package com.frvs.backend.service;

import com.frvs.backend.dto.AISimilarityRequest;
import com.frvs.backend.dto.AISimilarityResponse;
import com.frvs.backend.dto.AISentimentRequest;
import com.frvs.backend.dto.AISentimentResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import org.springframework.util.StringUtils;
import reactor.core.publisher.Mono;

import java.time.Duration;
import java.util.List;
import java.util.Collections;

@Service
public class AIService {

    private static final Logger log = LoggerFactory.getLogger(AIService.class);

    private final WebClient webClient;

    @Value("${ai.similarity-service.url}")
    private String similarityUrl;

    @Value("${ai.similarity-service.token:}")
    private String similarityToken;

    @Value("${ai.sentiment-service.url}")
    private String sentimentUrl;

    public AIService(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.build();
    }

    public AISimilarityResponse getSimilarity(AISimilarityRequest request) {
        try {
            int existingCount = request.getExisting_features() == null ? 0 : request.getExisting_features().size();
            log.info("Sending similarity request to {} with new_feature='{}' and {} existing features",
                    similarityUrl,
                    request.getNew_feature(),
                    existingCount);

            AISimilarityResponse response = callSimilarityService(request)
                    .timeout(Duration.ofSeconds(5))
                    .block();

            if (response == null) {
                log.warn("Similarity service call returned null response from {}", similarityUrl);
                AISimilarityResponse fallback = new AISimilarityResponse();
                fallback.setResults(Collections.emptyList());
                return fallback;
            }
            if (response.getResults() == null) {
                response.setResults(Collections.emptyList());
            }

            log.info("Similarity service call succeeded from {} with {} results",
                    similarityUrl,
                    response.getResults().size());
            return response;
        } catch (WebClientResponseException e) {
            log.error("Similarity service HTTP error calling {}: status={}, body={}",
                    similarityUrl,
                    e.getStatusCode(),
                    e.getResponseBodyAsString(),
                    e);
            AISimilarityResponse fallback = new AISimilarityResponse();
            fallback.setResults(Collections.emptyList());
            return fallback;
        } catch (Exception e) {
            log.error("Similarity service call failed for {}", similarityUrl, e);
            AISimilarityResponse fallback = new AISimilarityResponse();
            fallback.setResults(Collections.emptyList());
            return fallback;
        }
    }

    public void verifySimilarityServiceConnectivity() {
        AISimilarityRequest request = new AISimilarityRequest();
        request.setNew_feature("Spring Boot similarity service startup probe");

        AISimilarityRequest.ExistingFeature existingFeature = new AISimilarityRequest.ExistingFeature();
        existingFeature.setFeature_id("startup-probe");
        existingFeature.setTitle("Startup probe feature");
        request.setExisting_features(List.of(existingFeature));

        try {
            AISimilarityResponse response = callSimilarityService(request)
                    .timeout(Duration.ofSeconds(60))
                    .block();

            int resultCount = response == null || response.getResults() == null ? 0 : response.getResults().size();
            log.info("Similarity service startup probe succeeded for {} with {} results",
                    similarityUrl,
                    resultCount);
        } catch (Exception e) {
            log.warn(
                "Similarity service unavailable during startup. " +
                "Application will continue and retry during normal requests.",e
            );
        }
    }

    private Mono<AISimilarityResponse> callSimilarityService(AISimilarityRequest request) {
        if (!StringUtils.hasText(similarityToken)) {
            return Mono.error(new IllegalStateException("AI similarity token is missing"));
        }

        return webClient.post()
                    .uri(similarityUrl)
                    .header(HttpHeaders.AUTHORIZATION, "Bearer " + similarityToken)
                    .bodyValue(request)
                    .retrieve()
                    .onStatus(status -> status.isError(), clientResponse ->
                            clientResponse.bodyToMono(String.class)
                                    .defaultIfEmpty("")
                                    .flatMap(body -> {
                                        log.error("Similarity service returned HTTP {} from {}. Body: {}",
                                                clientResponse.statusCode().value(),
                                                similarityUrl,
                                                body);
                                        return Mono.error(
                                                new IllegalStateException("Similarity service returned HTTP " + clientResponse.statusCode().value()));
                                    }))
                    .bodyToMono(AISimilarityResponse.class);
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
            log.error("Sentiment service call failed for {}", sentimentUrl, e);
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
