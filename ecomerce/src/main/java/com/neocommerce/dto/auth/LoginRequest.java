package com.neocommerce.dto.auth;

public record LoginRequest(
    String email,
    String password
) {}
