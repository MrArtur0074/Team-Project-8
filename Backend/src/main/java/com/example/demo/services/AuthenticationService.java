package com.example.demo.services;

import com.example.demo.models.Role;
import com.example.demo.models.User;
import com.example.demo.repositories.UserRepository;
import com.example.demo.security.AuthenticationRequest;
import com.example.demo.security.AuthenticationResponse;
import com.example.demo.security.RegisterRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Random;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthenticationService {
    private final UserRepository repository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final EmailService emailService;

    public AuthenticationResponse register(RegisterRequest request) {
        User user;

        if (request.getRole().equals("USER")) {
            user = User.builder()
                    .username("anonimus_" + UUID.randomUUID().toString().substring(0, 8)) // Генерация username
                    .email(request.getEmail())
                    .password(passwordEncoder.encode(request.getPassword()))
                    .role(Role.USER)
                    .build();
        } else if (request.getRole().equals("MANAGER")) {
            validateEmail(request.getEmail());
            validateUsername(request.getUsername());

            user = User.builder()
                    .username(request.getUsername())
                    .email(request.getEmail())
                    .password(passwordEncoder.encode(request.getPassword()))
                    .role(Role.MANAGER)
                    .managerCode(UUID.randomUUID().toString().substring(0, 6))
                    .build();
        } else {
            throw new IllegalArgumentException("Invalid role selected");
        }
//        String code = String.format("%06d", new Random().nextInt(999999));
//        user.setVerificationCode(code);
//        user.setVerified(false);
//        sendVerificationEmail(user.getEmail(), code);

        repository.save(user);
        var jwtToken = jwtService.generateToken(user);
        AuthenticationResponse build = AuthenticationResponse.builder()
                .token(jwtToken)
                .username(user.getUsername())
                .email(user.getEmail())
                .build();
        return build;
    }

    private void validateEmail(String email) {
        if (repository.findByEmail(email).isPresent()) {
            throw new IllegalArgumentException("Email already in use");
        }
    }

    private void validateUsername(String username) {
        if (repository.findByUsername(username).isPresent()) {
            throw new IllegalArgumentException("Username already in use");
        }
    }

    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        // Используем username для аутентификации
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsername(),  // Теперь передаем username
                        request.getPassword()
                )
        );

        // Находим пользователя по username
        var user = repository.findByUsername(request.getUsername())  // Теперь ищем по username
                .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + request.getUsername()));

        var jwtToken = jwtService.generateToken(user);

        return AuthenticationResponse.builder()
                .token(jwtToken)
                .build();
    }
    private void sendVerificationEmail(String email, String code) {
        emailService.sendVerificationEmail(email, code);
    }

    public void verifyEmail(String code) {
        User user = repository.findByVerificationCode(code)
                .orElseThrow(() -> new IllegalArgumentException("Invalid code"));
        user.setVerified(true);
        user.setVerificationCode(null);
        repository.save(user);
    }



}
