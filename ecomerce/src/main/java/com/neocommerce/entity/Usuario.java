package com.neocommerce.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.io.Serializable;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

@Entity
@Table(name = "usuario")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Usuario implements Serializable {

  private static final long serialVersionUID = 1L;

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "document_number", nullable = false, unique = true)
  private Long documentNumber;

  @Enumerated(EnumType.STRING)
  @Column(name = "document_type", nullable = false, length = 10)
  private DocumentType documentType;

  @Column(name = "username", nullable = false, length = 100)
  private String username;

  @Column(name = "cellphone", length = 50)
  private String cellphone;

  @Column(name = "email", nullable = false, unique = true, length = 255)
  private String email;

  // Guarda siempre hash (BCrypt), no texto plano.
  @Column(name = "password", nullable = false, length = 255)
  private String password;

  @Enumerated(EnumType.STRING)
  @Column(name = "gender", length = 10)
  private Gender gender;

  @Column(name = "age")
  private Integer age;

  @Enumerated(EnumType.STRING)
  @Column(name = "rol", nullable = false, length = 20)
  private Rol rol;


  @Column(name = "activo", nullable = false)
  @Builder.Default
  private Boolean activo = Boolean.TRUE;

  @CreationTimestamp
  @Column(name = "creado_en", updatable = false, nullable = false)
  private LocalDateTime creadoEn;

  @UpdateTimestamp
  @Column(name = "actualizado_en", nullable = false)
  private LocalDateTime actualizadoEn;

  public enum DocumentType { CC, TI, PAS }
  public enum Gender { M, F, OTRO }
  public enum Rol { CLIENTE, VENDEDOR, ADMIN }
}
