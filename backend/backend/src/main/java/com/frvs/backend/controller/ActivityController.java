package com.frvs.backend.controller;

import com.frvs.backend.dto.UserActivityDto;
import com.frvs.backend.entity.AppUser;
import com.frvs.backend.service.ActivityService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/activity")
public class ActivityController {

    private final ActivityService activityService;

    public ActivityController(ActivityService activityService) {
        this.activityService = activityService;
    }

    @GetMapping("/me")
    public ResponseEntity<UserActivityDto> getMyActivity(@AuthenticationPrincipal AppUser user) {
        return ResponseEntity.ok(activityService.getActivity(user));
    }
}