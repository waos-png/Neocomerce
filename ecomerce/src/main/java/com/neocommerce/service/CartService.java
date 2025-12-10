package com.neocommerce.service;

import com.neocommerce.entity.Cart;
import com.neocommerce.entity.CartItem;
import com.neocommerce.entity.Producto;
import com.neocommerce.entity.Usuario;
import com.neocommerce.repository.CartItemRepository;
import com.neocommerce.repository.CartRepository;
import com.neocommerce.repository.ProductoRepository;
import com.neocommerce.repository.UsuarioRepository;
import java.math.BigDecimal;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CartService {

  private final CartRepository cartRepository;
  private final CartItemRepository cartItemRepository;
  private final ProductoRepository productoRepository;
  private final UsuarioRepository usuarioRepository;

  @Transactional
  public Cart getOrCreateActiveCart(Long usuarioId) {
    return cartRepository.findByUsuarioIdAndActiveTrue(usuarioId)
        .orElseGet(() -> {
          Usuario user = usuarioRepository.findById(usuarioId)
              .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado id=" + usuarioId));
          Cart cart = Cart.builder()
              .usuario(user)
              .active(Boolean.TRUE)
              .build();
          return cartRepository.save(cart);
        });
  }

  @Transactional
  public Cart addItem(Long usuarioId, Long productId, int quantity) {
    if (quantity <= 0) quantity = 1;
    Cart cart = getOrCreateActiveCart(usuarioId);
    Producto producto = productoRepository.findById(productId)
        .orElseThrow(() -> new IllegalArgumentException("Producto no encontrado id=" + productId));

    Optional<CartItem> existing = cartItemRepository.findByCartIdAndProductId(cart.getId(), productId);
    CartItem item;
    if (existing.isPresent()) {
      item = existing.get();
      item.changeQuantity(quantity);
    } else {
      item = CartItem.builder()
          .cart(cart)
          .product(producto)
          .quantity(quantity)
          .priceAtAdd(producto.getPrice() != null ? producto.getPrice() : BigDecimal.ZERO)
          .build();
      cart.addItem(item);
    }
    cartItemRepository.save(item);
    return cartRepository.save(cart);
  }

  @Transactional
  public Cart removeItem(Long usuarioId, Long productId) {
    Cart cart = getOrCreateActiveCart(usuarioId);
    Optional<CartItem> existing = cartItemRepository.findByCartIdAndProductId(cart.getId(), productId);
    existing.ifPresent(item -> {
      cart.removeItem(item);
      cartItemRepository.delete(item);
    });
    return cartRepository.save(cart);
  }

  @Transactional
  public Cart emptyCart(Long usuarioId) {
    Cart cart = getOrCreateActiveCart(usuarioId);
    cartItemRepository.deleteAllByCartId(cart.getId());
    cart.getItems().clear();
    return cartRepository.save(cart);
  }
}
