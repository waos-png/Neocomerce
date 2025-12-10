package com.neocommerce.dto.pedido;

import com.neocommerce.entity.Pedido;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record PedidoResponse(
    Long id,
    Long usuarioId,
    Pedido.Estado estado,
    BigDecimal total,
    LocalDateTime fecha,
    LocalDateTime actualizadoEn,
    List<ItemResponse> items
) {
  public record ItemResponse(
      Long id,
      Long productId,
      String productName,
      Integer quantity,
      BigDecimal price,
      BigDecimal subtotal
  ) {}
}
