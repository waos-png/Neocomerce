package com.neocommerce.dto.auth;

public record RegisterRequest(
    Long documentNumber,
    String documentType,
    String username,
    String cellphone,
    String email,
    String password,
    String gender,
    Integer age,
    String rol  
) {}
