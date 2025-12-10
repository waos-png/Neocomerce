package com.neocommerce.dto.categoria;

public record CategoryRequest(
    String name,
    String type,
    String classification
) {}
