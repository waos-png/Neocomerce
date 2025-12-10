package com.neocommerce.dto.auth;

public record AuthResponse(
    Long id,
    String email,
    String username,
    String rol,
    String token
) {}
