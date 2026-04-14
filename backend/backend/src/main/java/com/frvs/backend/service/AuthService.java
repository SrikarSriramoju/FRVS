package com.frvs.backend.service;

import com.frvs.backend.dto.AuthRequest;
import com.frvs.backend.dto.AuthResponse;
import com.frvs.backend.dto.DevRegisterRequest;
import com.frvs.backend.entity.AppUser;
import com.frvs.backend.entity.Role;
import com.frvs.backend.repository.AppUserRepository;
import com.frvs.backend.security.JwtTokenProvider;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.util.UUID;

@Service
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final AppUserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;

    public AuthService(AuthenticationManager authenticationManager,
                       AppUserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       JwtTokenProvider tokenProvider) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenProvider = tokenProvider;
    }

    public AuthResponse authenticateDev(AuthRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getEmail(),
                        loginRequest.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = tokenProvider.generateToken(loginRequest.getEmail());
        
        AppUser user = userRepository.findByEmail(loginRequest.getEmail()).orElseThrow();
        
        return AuthResponse.builder().token(jwt).user(user).build();
    }

    public AuthResponse registerDev(DevRegisterRequest registerRequest) {
        if(userRepository.findByEmail(registerRequest.getEmail()).isPresent()){
            throw new RuntimeException("Email already exists");
        }

        String generatedProductKey = registerRequest.getOrganization().toLowerCase().replaceAll("\\s+", "-") + "-" + UUID.randomUUID().toString().substring(0, 4);

        AppUser dev = AppUser.builder()
                .email(registerRequest.getEmail())
                .name(registerRequest.getName())
                .password(passwordEncoder.encode(registerRequest.getPassword()))
                .organization(registerRequest.getOrganization())
                .role(Role.DEVELOPER)
                .productKey(generatedProductKey)
                .build();

        userRepository.save(dev);

        String jwt = tokenProvider.generateToken(dev.getEmail());
        return AuthResponse.builder().token(jwt).user(dev).build();
    }

    public AuthResponse authProductUser(String tokenParam) {
        // Find existing developer to bind to (since we are doing a demo)
        String activeProductKey = userRepository.findAll().stream()
                .filter(u -> u.getRole() == Role.DEVELOPER)
                .map(AppUser::getProductKey)
                .findFirst()
                .orElse("default-org-key");

        String stableToken = tokenParam == null || tokenParam.isBlank() ? "demo-token" : tokenParam.trim();
        String stableGuestId = UUID.nameUUIDFromBytes(stableToken.getBytes(StandardCharsets.UTF_8)).toString();
        String guestEmail = "guest-" + stableGuestId + "@test.com";

        AppUser mockUser = userRepository.findByEmail(guestEmail)
                .map(existing -> {
                    existing.setName("Guest User");
                    existing.setRole(Role.USER);
                    existing.setProductKey(activeProductKey);
                    return existing;
                })
                .orElseGet(() -> AppUser.builder()
                        .name("Guest User")
                        .email(guestEmail)
                        .role(Role.USER)
                        .productKey(activeProductKey)
                        .build());

        AppUser saved = userRepository.save(mockUser);
        String jwt = tokenProvider.generateToken(saved.getEmail());
        
        return AuthResponse.builder().token(jwt).user(saved).build();
    }
}
