package com.neocommerce.mapper;

import com.neocommerce.dto.vendedor.VendedorRequest;
import com.neocommerce.dto.vendedor.VendedorResponse;
import com.neocommerce.dto.vendedor.VendedorUpdateRequest;
import com.neocommerce.entity.Usuario;
import com.neocommerce.entity.Vendedor;
import jakarta.annotation.Nonnull;
import jakarta.annotation.Nullable;

public final class VendedorMapper {

  private VendedorMapper() {}

  public static VendedorResponse toDto(@Nonnull Vendedor v) {
    return new VendedorResponse(
        v.getId(),
        v.getUsuario() != null ? v.getUsuario().getId() : null,
        v.getNombreTienda(),
        v.getNitORfc(),
        v.getTelefono(),
        v.getDireccion(),
        v.getCiudad(),
        v.getPais(),
        v.getVerificado()
    );
  }

  public static Vendedor toEntity(@Nonnull VendedorRequest request, @Nonnull Usuario usuario) {
    Vendedor v = new Vendedor();
    v.setUsuario(usuario);
    v.setNombreTienda(request.nombreTienda());
    v.setNitORfc(request.nitORfc());
    v.setTelefono(request.telefono());
    v.setDireccion(request.direccion());
    v.setCiudad(request.ciudad());
    v.setPais(request.pais());
    v.setVerificado(request.verificado() != null ? request.verificado() : Boolean.FALSE);
    return v;
  }

  public static void applyUpdates(@Nonnull Vendedor target, @Nullable VendedorUpdateRequest request) {
    if (request == null) return;
    if (request.nombreTienda() != null) target.setNombreTienda(request.nombreTienda());
    if (request.nitORfc() != null) target.setNitORfc(request.nitORfc());
    if (request.telefono() != null) target.setTelefono(request.telefono());
    if (request.direccion() != null) target.setDireccion(request.direccion());
    if (request.ciudad() != null) target.setCiudad(request.ciudad());
    if (request.pais() != null) target.setPais(request.pais());
    if (request.verificado() != null) target.setVerificado(request.verificado());
  }
}
