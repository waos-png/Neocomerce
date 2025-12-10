package com.neocommerce.repository;

import com.neocommerce.entity.Pedido;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PedidoRepository extends JpaRepository<Pedido, Long> {
  List<Pedido> findByUsuarioIdOrderByFechaDesc(Long usuarioId);
  Optional<Pedido> findTop1ByUsuarioIdOrderByFechaDesc(Long usuarioId);
}
