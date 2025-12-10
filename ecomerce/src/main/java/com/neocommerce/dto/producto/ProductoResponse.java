package com.neocommerce.dto.producto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record ProductoResponse(
    Long id,
    String productName,
    String description,
    BigDecimal price,
    String imageUrl,
    BigDecimal rating,
    Integer stock,
    Boolean activo,
    VendedorMini vendedor,
    List<CategoriaMini> categorias,
    LocalDateTime creadoEn,
    LocalDateTime actualizadoEn
) {

  public record VendedorMini(
      Long id,
      String nombreTienda,
      Boolean verificado
  ) {}

  public record CategoriaMini(
      Long id,
      String name,
      String type,
      String classification
  ) {}
}
