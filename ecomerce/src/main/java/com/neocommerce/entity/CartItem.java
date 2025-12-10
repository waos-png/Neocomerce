package com.neocommerce.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.io.Serializable;
import java.math.BigDecimal;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Table(name = "cart_item")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@ToString(exclude = {"cart", "product"})
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class CartItem implements Serializable {

  private static final long serialVersionUID = 1L;

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @EqualsAndHashCode.Include
  private Long id;

  @JsonIgnore
  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "cart_id", nullable = false)
  private Cart cart;

  @JsonIgnore
  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "product_id", nullable = false)
  private Producto product;

  @Column(name = "quantity", nullable = false)
  private Integer quantity;

  @Column(name = "price_at_add", nullable = false, precision = 12, scale = 2)
  private BigDecimal priceAtAdd;

  /** Ajusta la cantidad con un delta; asegura mínimo 1. */
  public void changeQuantity(int delta) {
    int current = this.quantity == null ? 0 : this.quantity;
    int next = current + delta;
    this.quantity = Math.max(next, 1);
  }

  /** Subtotal: precio guardado * cantidad (usa 0 si es nulo). */
  public BigDecimal getSubtotal() {
    BigDecimal price = priceAtAdd != null ? priceAtAdd : BigDecimal.ZERO;
    int qty = quantity != null ? quantity : 0;
    return price.multiply(BigDecimal.valueOf(qty));
  }
}
