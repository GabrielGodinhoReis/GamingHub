package com.gaminghub.backend.service;

import org.springframework.stereotype.Service;

@Service
public class AuthService {

    public boolean autenticar(String email, String password) {

        String adminEmail = System.getenv("ADMIN_EMAIL");
        String adminPassword = System.getenv("ADMIN_PASSWORD");

        if (adminEmail == null || adminPassword == null) {
            return false;
        }

        return adminEmail.equals(email)
            && adminPassword.equals(password);
    }
}