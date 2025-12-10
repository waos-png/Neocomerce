package com.neocommerce.dto.categoria;

public record CategoryResponse(
    Long id,
    String name,
    String type,
    String classification
) {}
