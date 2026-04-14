package com.frvs.backend.controller;

import com.frvs.backend.dto.AnalyticsSummaryDto;
import com.frvs.backend.dto.FeatureClusterDto;
import com.frvs.backend.entity.AppUser;
import com.frvs.backend.service.AnalyticsService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    public AnalyticsController(AnalyticsService analyticsService) {
        this.analyticsService = analyticsService;
    }

    @GetMapping("/summary")
    public ResponseEntity<AnalyticsSummaryDto> getSummary(@AuthenticationPrincipal AppUser user) {
        return ResponseEntity.ok(analyticsService.getSummary(user.getProductKey()));
    }

    @GetMapping("/clusters")
    public ResponseEntity<List<FeatureClusterDto>> getClusters(@AuthenticationPrincipal AppUser user) {
        return ResponseEntity.ok(analyticsService.getClusters(user.getProductKey()));
    }

    @GetMapping("/report")
    public ResponseEntity<byte[]> getPdfReport(@AuthenticationPrincipal AppUser user, @RequestParam(required = false) String clusterIds) {
        List<String> selectedClusterIds = clusterIds == null || clusterIds.isBlank()
                ? Collections.emptyList()
                : Arrays.stream(clusterIds.split(","))
                    .map(String::trim)
                    .filter(id -> !id.isBlank())
                    .collect(Collectors.toList());
        byte[] pdf = analyticsService.generatePdfReport(user.getProductKey(), selectedClusterIds);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("attachment", "Analytics_Report.pdf");

        return ResponseEntity.ok().headers(headers).body(pdf);
    }
}
