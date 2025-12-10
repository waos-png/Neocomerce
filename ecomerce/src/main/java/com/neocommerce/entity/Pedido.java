package com.neocommerce.entity;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

@Entity
@Table(name = "pedido")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@ToString(exclude = {"usuario", "items"})
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class Pedido implements Serializable {

  private static final long serialVersionUID = 1L;

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @EqualsAndHashCode.Include
  private Long id;

  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "usuario_id", nullable = false)
  private Usuario usuario;

  @Enumerated(EnumType.STRING)
  @Column(name = "estado", nullable = false, length = 20)
  @Builder.Default
  private Estado estado = Estado.PENDIENTE;

  @Column(name = "total", nullable = false, precision = 12, scale = 2)
  @Builder.Default
  private BigDecimal total = BigDecimal.ZERO;

  @CreationTimestamp
  @Column(name = "fecha", updatable = false, nullable = false)
  private LocalDateTime fecha;

  @UpdateTimestamp
  @Column(name = "actualizado_en", nullable = false)
  private LocalDateTime actualizadoEn;

  @OneToMany(mappedBy = "pedido", cascade = CascadeType.ALL, orphanRemoval = true)
  @Builder.Default
  private List<PedidoItem> items = new ArrayList<>();

  public enum Estado {
    PENDIENTE,
    PAGADO,
    ENVIADO,
    ENTREGADO,
    CANCELADO
  }

  /** Recalcula el total a partir de los items (usa subtotales nulos como 0). */
  public void recalcTotal() {
    BigDecimal sum = BigDecimal.ZERO;
    for (PedidoItem item : items) {
      if (item != null && item.getSubtotal() != null) {
        sum = sum.add(item.getSubtotal());
      }
    }
    this.total = sum;
  }

  public void addItem(PedidoItem item) {
    items.add(item);
    item.setPedido(this);
    recalcTotal();
  }

  public void removeItem(PedidoItem item) {
    items.remove(item);
    item.setPedido(null);
    recalcTotal();
  }
}
