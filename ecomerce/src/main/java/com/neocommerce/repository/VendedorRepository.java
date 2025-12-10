package com.neocommerce.repository;

import com.neocommerce.entity.Vendedor;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VendedorRepository extends JpaRepository<Vendedor, Long> {
  Optional<Vendedor> findByUsuarioId(Long usuarioId);
  Optional<Vendedor> findByUsuario_EmailIgnoreCase(String email);
  boolean existsByUsuarioId(Long usuarioId);
}
