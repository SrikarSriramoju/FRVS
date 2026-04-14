package com.frvs.backend.dto;

import lombok.Data;

@Data
public class DevRegisterRequest {
    private String name;
    private String email;
    private String password;
    private String organization;
}
