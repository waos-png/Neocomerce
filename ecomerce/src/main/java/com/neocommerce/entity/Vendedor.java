package com.neocommerce.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import java.io.Serializable;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import org.hibernate.annotations.CreationTimestamp;

@Entity
@Table(name = "vendedor")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@ToString(exclude = "usuario")
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class Vendedor implements Serializable {

  private static final long serialVersionUID = 1L;

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @EqualsAndHashCode.Include
  private Long id;

  @JsonIgnore
  @OneToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "usuario_id", nullable = false, unique = true)
  private Usuario usuario;

  @Column(name = "nombre_tienda", nullable = true, length = 255)
  private String nombreTienda;

  @Column(name = "nit_o_rfc", length = 50)
  private String nitORfc;

  @Column(name = "telefono", length = 50)
  private String telefono;

  @Column(name = "direccion", length = 255)
  private String direccion;

  @Column(name = "ciudad", length = 100)
  private String ciudad;

  @Column(name = "pais", length = 100)
  private String pais;

  @Column(name = "verificado", nullable = false)
  @Builder.Default
  private Boolean verificado = Boolean.FALSE;

  @CreationTimestamp
  @Column(name = "creado_en", nullable = false, updatable = false)
  private LocalDateTime creadoEn;
}
