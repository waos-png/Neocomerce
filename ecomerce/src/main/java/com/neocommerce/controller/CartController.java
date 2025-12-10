package com.neocommerce.controller;

import com.neocommerce.dto.cart.AddToCartRequest;
import com.neocommerce.dto.cart.CartResponse;
import com.neocommerce.mapper.CartMapper;
import com.neocommerce.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/cart")
@RequiredArgsConstructor
public class CartController {

  private final CartService cartService;

  @GetMapping
  public ResponseEntity<CartResponse> getCart(@RequestParam("userId") Long userId) {
    return ResponseEntity.ok(CartMapper.toDto(cartService.getOrCreateActiveCart(userId)));
  }

  @PostMapping("/add")
  public ResponseEntity<CartResponse> addToCart(
      @RequestParam("userId") Long userId,
      @RequestBody AddToCartRequest request
  ) {
    return ResponseEntity.ok(
        CartMapper.toDto(cartService.addItem(userId, request.productId(), request.quantity()))
    );
  }

  @PostMapping("/remove")
  public ResponseEntity<CartResponse> removeFromCart(
      @RequestParam("userId") Long userId,
      @RequestBody AddToCartRequest request
  ) {
    return ResponseEntity.ok(
        CartMapper.toDto(cartService.removeItem(userId, request.productId()))
    );
  }

  @PostMapping("/empty")
  public ResponseEntity<CartResponse> emptyCart(@RequestParam("userId") Long userId) {
    return ResponseEntity.ok(CartMapper.toDto(cartService.emptyCart(userId)));
  }
}
