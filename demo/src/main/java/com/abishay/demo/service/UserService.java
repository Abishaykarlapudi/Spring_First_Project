package com.abishay.demo.service;

import com.abishay.demo.dto.AuthResponse;
import com.abishay.demo.dto.LoginRequest;
import com.abishay.demo.dto.RegisterRequest;
import com.abishay.demo.model.UserEntity;

public interface UserService {
    AuthResponse register(RegisterRequest request);
    AuthResponse login(LoginRequest request);
    UserEntity getUserById(Integer id);
}
