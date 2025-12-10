package com.neocommerce.dto.cart;

public record AddToCartRequest(
    Long productId,
    Integer quantity
) {}
