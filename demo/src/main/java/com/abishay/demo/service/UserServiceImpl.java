package com.abishay.demo.service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.abishay.demo.dto.AuthResponse;
import com.abishay.demo.dto.LoginRequest;
import com.abishay.demo.dto.RegisterRequest;
import com.abishay.demo.model.UserEntity;
import com.abishay.demo.repo.UserRepo;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepo userRepo;

    private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    @Override
    public AuthResponse register(RegisterRequest request) {
        if (request == null || request.getEmail() == null || request.getEmail().trim().isEmpty()) {
            return new AuthResponse(false, "Email address is required.");
        }
        if (request.getFullName() == null || request.getFullName().trim().isEmpty()) {
            return new AuthResponse(false, "Full name is required.");
        }
        if (request.getPassword() == null || request.getPassword().length() < 6) {
            return new AuthResponse(false, "Password must be at least 6 characters long.");
        }

        String normalizedEmail = request.getEmail().trim().toLowerCase();
        if (userRepo.existsByEmail(normalizedEmail)) {
            return new AuthResponse(false, "An account with this email address already exists.");
        }

        UserEntity user = new UserEntity();
        user.setFullName(request.getFullName().trim());
        user.setEmail(normalizedEmail);
        user.setPassword(request.getPassword()); // In production, hash with BCrypt
        user.setRole("USER");
        user.setCreatedAt(LocalDateTime.now().format(FORMATTER));

        UserEntity saved = userRepo.save(user);

        return new AuthResponse(
            true, 
            "Account registered successfully!", 
            saved.getId(), 
            saved.getFullName(), 
            saved.getEmail(), 
            saved.getRole()
        );
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        if (request == null || request.getEmail() == null || request.getPassword() == null) {
            return new AuthResponse(false, "Email and password are required.");
        }

        String normalizedEmail = request.getEmail().trim().toLowerCase();
        Optional<UserEntity> userOpt = userRepo.findByEmail(normalizedEmail);

        if (userOpt.isEmpty()) {
            return new AuthResponse(false, "Invalid email or password.");
        }

        UserEntity user = userOpt.get();
        if (!user.getPassword().equals(request.getPassword())) {
            return new AuthResponse(false, "Invalid email or password.");
        }

        return new AuthResponse(
            true, 
            "Login successful!", 
            user.getId(), 
            user.getFullName(), 
            user.getEmail(), 
            user.getRole()
        );
    }

    @Override
    public UserEntity getUserById(Integer id) {
        return userRepo.findById(id).orElse(null);
    }
}
