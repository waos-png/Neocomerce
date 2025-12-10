package com.neocommerce.mapper;

import com.neocommerce.dto.usuario.UsuarioResponse;
import com.neocommerce.entity.Usuario;

public final class UsuarioMapper {

  private UsuarioMapper() {}

  public static UsuarioResponse toDto(Usuario u) {
    if (u == null) return null;
    return new UsuarioResponse(
        u.getId(),
        u.getDocumentNumber(),
        u.getDocumentType() != null ? u.getDocumentType().name() : null,
        u.getEmail(),
        u.getUsername(),
        u.getCellphone(),
        u.getGender() != null ? u.getGender().name() : null,
        u.getAge(),
        u.getRol() != null ? u.getRol().name() : null,
        u.getActivo()
    );
  }
}
