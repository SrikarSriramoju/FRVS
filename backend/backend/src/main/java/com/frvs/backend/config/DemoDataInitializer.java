package com.frvs.backend.config;

import com.frvs.backend.entity.AppUser;
import com.frvs.backend.entity.Role;
import com.frvs.backend.repository.AppUserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DemoDataInitializer {

    @Bean
    public CommandLineRunner initDemoDev(AppUserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            String demoEmail = "dev@techcorp.com";
            if (userRepository.findByEmail(demoEmail).isEmpty()) {
                AppUser dev = AppUser.builder()
                        .name("Demo Developer")
                        .email(demoEmail)
                        .password(passwordEncoder.encode("password")) // any password
                        .organization("TechCorp Inc. (Demo)")
                        .role(Role.DEVELOPER)
                        .productKey("default-org-key") // Matches the guest user token!
                        .build();
                userRepository.save(dev);
            }
        };
    }
}
