package com.frvs.backend.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

@Component
public class AIServiceStartupProbe {

    private static final Logger log = LoggerFactory.getLogger(AIServiceStartupProbe.class);

    private final AIService aiService;

    public AIServiceStartupProbe(AIService aiService) {
        this.aiService = aiService;
    }

    @EventListener(ApplicationReadyEvent.class)
    public void verifySimilarityServiceOnStartup() {
        log.info("Checking AI similarity service connectivity during Spring Boot startup...");
        try {
            aiService.verifySimilarityServiceConnectivity();
            log.info("AI similarity service is reachable and authenticated successfully.");
        } catch (Exception e) {
            log.error("AI similarity service startup check failed. Please verify the Hugging Face token, URL, and network connectivity.", e);
        }
    }
}