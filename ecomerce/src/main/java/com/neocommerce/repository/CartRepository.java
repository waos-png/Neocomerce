package com.neocommerce.repository;

import com.neocommerce.entity.Cart;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CartRepository extends JpaRepository<Cart, Long> {
  Optional<Cart> findByUsuarioIdAndActiveTrue(Long usuarioId);
}
