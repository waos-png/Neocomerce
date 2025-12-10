package com.neocommerce.dto.pedido;

import java.math.BigDecimal;
import java.util.List;

public record PedidoRequest(
    Long usuarioId,
    List<ItemRequest> items
) {
  public record ItemRequest(
      Long productId,
      Integer quantity,
      BigDecimal price
  ) {}
}
