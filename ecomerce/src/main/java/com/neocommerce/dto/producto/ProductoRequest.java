package com.neocommerce.dto.producto;

import java.math.BigDecimal;
import java.util.Set;

public record ProductoRequest(
    String productName,
    String description,
    BigDecimal price,
    String imageUrl,
    BigDecimal rating,
    Integer stock,
    Long vendedorId,
    Long sellerId,
    Set<Long> categoryIds,
    Boolean activo
) {}
