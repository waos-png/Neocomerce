package com.neocommerce.repository;

import com.neocommerce.entity.PedidoItem;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PedidoItemRepository extends JpaRepository<PedidoItem, Long> {
  List<PedidoItem> findByPedidoId(Long pedidoId);
  List<PedidoItem> findByProductoId(Long productId);
  List<PedidoItem> findByPedido_UsuarioId(Long usuarioId);
  void deleteAllByPedidoId(Long pedidoId);
}
