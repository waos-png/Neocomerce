package com.neocommerce.dto.usuario;

public record UsuarioResponse(
    Long id,
    Long documentNumber,
    String documentType,
    String email,
    String username,
    String cellphone,
    String gender,
    Integer age,
    String rol,
    Boolean activo
) {}
