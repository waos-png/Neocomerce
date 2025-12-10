package com.neocommerce.repository;

import com.neocommerce.entity.Usuario;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
  Optional<Usuario> findByEmailIgnoreCase(String email);
  Optional<Usuario> findByDocumentNumber(Long documentNumber);
  boolean existsByEmailIgnoreCase(String email);
  boolean existsByDocumentNumber(Long documentNumber);
}
