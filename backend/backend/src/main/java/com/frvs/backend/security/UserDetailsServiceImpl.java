package com.frvs.backend.security;

import com.frvs.backend.entity.AppUser;
import com.frvs.backend.repository.AppUserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    private final AppUserRepository appUserRepository;

    public UserDetailsServiceImpl(AppUserRepository appUserRepository) {
        this.appUserRepository = appUserRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // Here username is email in our context but could also be ID if internal JWT
        return appUserRepository.findByEmail(username)
                .orElseGet(() -> appUserRepository.findById(username)
                        .orElseThrow(() -> new UsernameNotFoundException("User not found with email or id: " + username)));
    }
}
