package com.example.demo.dto;

import com.example.demo.models.Role;
import lombok.Data;

@Data
public class UserRegistrationDto {
    private String username;
    private String password;
    private String email;
    private Role role;
}
