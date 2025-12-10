package com.neocommerce.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Table(name = "product_category")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@ToString(exclude = "productos")
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class ProductCategory implements Serializable {

  private static final long serialVersionUID = 1L;

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @EqualsAndHashCode.Include
  private Long id;

  @Column(name = "name", nullable = false, length = 100)
  private String name;

  @Enumerated(EnumType.STRING)
  @Column(name = "type", length = 100)
  private CategoryType type;

  @Enumerated(EnumType.STRING)
  @Column(name = "classification", length = 100)
  private Classification classification;

  @JsonIgnore
  @ManyToMany(mappedBy = "categorias")
  @Builder.Default
  private Set<Producto> productos = new HashSet<>();

  public enum CategoryType {
    ELECTRONICA,
    CALZADO,
    MUEBLES,
    ELECTRODOMESTICO,
    ACCESORIOS,
    CONSOLA,
    PERFUME,
    SALUD,
    ROPA,
    OTRO
  }

  public enum Classification {
    PREMIUM,
    DEPORTIVO,
    GAMER,
    SMART,
    FITNESS,
    LUJO,
    CONFORT,
    CASUAL,
    GENERAL
  }
}
