package com.neocommerce.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;
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
@Table(name = "product")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@ToString(exclude = {"vendedor", "categorias"})
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class Producto implements Serializable {

  private static final long serialVersionUID = 1L;

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @EqualsAndHashCode.Include
  private Long id;

  @Column(name = "product_name", nullable = false, length = 255)
  private String productName;

  @Column(name = "description")
  private String description;

  @Column(name = "price", nullable = false, precision = 12, scale = 2)
  private BigDecimal price;

  @Column(name = "image_url")
  private String imageUrl;

  @Column(name = "rating", precision = 3, scale = 2)
  private BigDecimal rating;

  @Column(name = "stock")
  private Integer stock;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "seller_id")
  private Vendedor vendedor;

  @Column(name = "activo", nullable = false)
  @Builder.Default
  private Boolean activo = Boolean.TRUE;

  @ManyToMany(fetch = FetchType.LAZY)
  @JoinTable(
      name = "product_category_map",
      joinColumns = @JoinColumn(name = "product_id"),
      inverseJoinColumns = @JoinColumn(name = "category_id")
  )
  @Builder.Default
  private Set<ProductCategory> categorias = new HashSet<>();

  @CreationTimestamp
  @Column(name = "creado_en", updatable = false, nullable = false)
  private LocalDateTime creadoEn;

  @UpdateTimestamp
  @Column(name = "actualizado_en", nullable = false)
  private LocalDateTime actualizadoEn;
}
