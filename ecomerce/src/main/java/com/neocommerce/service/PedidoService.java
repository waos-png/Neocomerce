package com.neocommerce.service;

import com.neocommerce.entity.Pedido;
import com.neocommerce.entity.PedidoItem;
import com.neocommerce.entity.Usuario;
import com.neocommerce.repository.PedidoRepository;
import com.neocommerce.repository.UsuarioRepository;
import java.math.BigDecimal;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class PedidoService {

  private final PedidoRepository pedidoRepository;
  private final UsuarioRepository usuarioRepository;

  public List<Pedido> findByUsuario(Long usuarioId) {
    return pedidoRepository.findByUsuarioIdOrderByFechaDesc(usuarioId);
  }

  public Pedido findLastByUsuario(Long usuarioId) {
    return pedidoRepository.findTop1ByUsuarioIdOrderByFechaDesc(usuarioId).orElse(null);
  }

  public Pedido findByIdOrThrow(Long id) {
    return pedidoRepository.findById(id)
        .orElseThrow(() -> new IllegalArgumentException("Pedido no encontrado id=" + id));
  }

  @Transactional
  public Pedido createPedido(Long usuarioId, List<PedidoItem> items) {
    Usuario user = usuarioRepository.findById(usuarioId)
        .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado id=" + usuarioId));

    if (items == null || items.isEmpty()) {
      throw new IllegalArgumentException("El pedido debe contener al menos un item");
    }

    // Crear pedido vacío
    Pedido pedido = Pedido.builder()
        .usuario(user)
        .estado(Pedido.Estado.PENDIENTE)
        .total(BigDecimal.ZERO)
        .build();

    // Persistimos primero el pedido
    pedidoRepository.save(pedido);

    for (PedidoItem item : items) {
      if (item.getProducto() == null || item.getQuantity() == null || item.getPrice() == null) {
        throw new IllegalArgumentException("Item de pedido inválido");
      }
      item.setPedido(pedido);
      pedido.addItem(item); // gracias a cascade, no necesitas save(item)
    }

    // Recalcular total con items ya agregados
    pedido.recalcTotal();

    // JPA cascade se encarga de persistir items
    return pedidoRepository.save(pedido);
  }

  @Transactional
  public Pedido updateEstado(Long pedidoId, Pedido.Estado estado) {
    Pedido pedido = findByIdOrThrow(pedidoId);
    pedido.setEstado(estado);
    return pedidoRepository.save(pedido);
  }
}
