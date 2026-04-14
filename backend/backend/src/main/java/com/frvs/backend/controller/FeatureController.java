package com.frvs.backend.controller;

import com.frvs.backend.dto.FeatureDto;
import com.frvs.backend.entity.AppUser;
import com.frvs.backend.entity.FeatureRequest;
import com.frvs.backend.entity.FeatureStatus;
import com.frvs.backend.entity.VoteType;
import com.frvs.backend.service.FeatureService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/features")
public class FeatureController {

    private final FeatureService featureService;

    public FeatureController(FeatureService featureService) {
        this.featureService = featureService;
    }

    @GetMapping
    public ResponseEntity<List<FeatureRequest>> getFeatures(@AuthenticationPrincipal AppUser user) {
        return ResponseEntity.ok(featureService.getFeaturesByProductKey(user.getProductKey(), user));
    }

    @PostMapping
    public ResponseEntity<FeatureRequest> createFeature(@RequestBody FeatureDto request, @AuthenticationPrincipal AppUser user) {
        return ResponseEntity.ok(featureService.createFeature(request, user));
    }

    @PostMapping("/{id}/vote")
    public ResponseEntity<FeatureRequest> voteFeature(@PathVariable String id, @RequestParam String type, @AuthenticationPrincipal AppUser user) {
        return ResponseEntity.ok(featureService.voteFeature(id, user, VoteType.valueOf(type.toUpperCase())));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Void> updateStatus(@PathVariable String id, @RequestParam String status) {
        featureService.updateStatus(id, FeatureStatus.valueOf(status.toUpperCase()));
        return ResponseEntity.ok().build();
    }
}
