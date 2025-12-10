package com.neocommerce.dto.usuario;

public record UsuarioUpdateRequest(
    String username,
    String cellphone,
    String gender,
    Integer age
) {}
