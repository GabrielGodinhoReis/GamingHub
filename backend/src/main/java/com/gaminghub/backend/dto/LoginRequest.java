package com.gaminghub.backend.dto;

public record LoginRequest(
    String email,
    String password
) {}