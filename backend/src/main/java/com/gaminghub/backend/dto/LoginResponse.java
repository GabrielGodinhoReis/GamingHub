package com.gaminghub.backend.dto;

public record LoginResponse(
    String email,
    String name,
    String role
) {}