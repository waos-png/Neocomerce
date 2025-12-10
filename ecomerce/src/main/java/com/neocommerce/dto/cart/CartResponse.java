package com.neocommerce.dto.cart;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record CartResponse(
    Long id,
    Long usuarioId,
    Boolean active,
    LocalDateTime creadoEn,
    List<CartItemResponse> items,
    BigDecimal total
) {
  public record CartItemResponse(
      Long id,
      Long productId,
      String productName,
      String imageUrl,
      Integer quantity,
      BigDecimal priceAtAdd,
      BigDecimal subtotal
  ) {}
}
