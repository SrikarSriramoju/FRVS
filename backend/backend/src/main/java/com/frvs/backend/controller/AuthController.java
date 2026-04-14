package com.frvs.backend.controller;

import com.frvs.backend.dto.AuthRequest;
import com.frvs.backend.dto.AuthResponse;
import com.frvs.backend.dto.DevRegisterRequest;
import com.frvs.backend.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/dev/login")
    public ResponseEntity<AuthResponse> loginDev(@RequestBody AuthRequest request) {
        return ResponseEntity.ok(authService.authenticateDev(request));
    }

    @PostMapping("/dev/register")
    public ResponseEntity<AuthResponse> registerDev(@RequestBody DevRegisterRequest request) {
        return ResponseEntity.ok(authService.registerDev(request));
    }

    @PostMapping("/token")
    public ResponseEntity<AuthResponse> authWidgetToken(@RequestParam String token) {
        return ResponseEntity.ok(authService.authProductUser(token));
    }

    @GetMapping("/token")
    public ResponseEntity<AuthResponse> authWidgetTokenGet(@RequestParam String token) {
        return ResponseEntity.ok(authService.authProductUser(token));
    }
}
