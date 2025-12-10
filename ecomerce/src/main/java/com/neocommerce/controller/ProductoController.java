package com.neocommerce.controller;

import com.neocommerce.dto.producto.ProductoRequest;
import com.neocommerce.dto.producto.ProductoResponse;
import com.neocommerce.entity.Producto;
import com.neocommerce.entity.Vendedor;
import com.neocommerce.mapper.ProductoMapper;
import com.neocommerce.service.ProductoService;
import com.neocommerce.service.VendedorService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/products")
@RequiredArgsConstructor
public class ProductoController {

  private final ProductoService productoService;
  private final VendedorService vendedorService;

  @GetMapping
  public ResponseEntity<List<ProductoResponse>> list(
      @RequestParam(value = "q", required = false) String q,
      @RequestParam(value = "categoryId", required = false) Long categoryId
  ) {
    List<Producto> result;

    if (categoryId != null && q != null && !q.isBlank()) {
      result = productoService.findByCategoriaAndNombre(categoryId, q);
    } else if (categoryId != null) {
      result = productoService.findByCategoria(categoryId);
    } else if (q != null && !q.isBlank()) {
      result = productoService.search(q);
    } else {
      result = productoService.findAllActivos();
    }

    return ResponseEntity.ok(result.stream()
        .map(ProductoMapper::toDto)
        .toList());
  }

  @GetMapping("/{id}")
  public ResponseEntity<ProductoResponse> get(@PathVariable Long id) {
    return productoService.findById(id)
        .map(ProductoMapper::toDto)
        .map(ResponseEntity::ok)
        .orElse(ResponseEntity.notFound().build());
  }

  @PostMapping
  public ResponseEntity<ProductoResponse> create(@RequestBody ProductoRequest request) {

    Producto producto = new Producto();
    producto.setProductName(request.productName());
    producto.setDescription(request.description());
    producto.setPrice(request.price());
    producto.setImageUrl(request.imageUrl());
    producto.setRating(request.rating());
    producto.setStock(request.stock());
    producto.setActivo(request.activo() != null ? request.activo() : Boolean.TRUE);

    Long vendedorId = request.sellerId();
    if (vendedorId != null) {
      Vendedor vendedor = vendedorService.findByUsuarioId(vendedorId)
          .orElseThrow(() -> new IllegalArgumentException("Vendedor no existe id=" + vendedorId));
      producto.setVendedor(vendedor);
    }

    Producto created = productoService.create(producto, request.categoryIds());
    return ResponseEntity.ok(ProductoMapper.toDto(created));
  }

  @PutMapping("/{id}")
  public ResponseEntity<ProductoResponse> update(
      @PathVariable Long id,
      @RequestBody ProductoRequest request
  ) {

    Producto changes = new Producto();
    changes.setProductName(request.productName());
    changes.setDescription(request.description());
    changes.setPrice(request.price());
    changes.setImageUrl(request.imageUrl());
    changes.setRating(request.rating());
    changes.setStock(request.stock());
    changes.setActivo(request.activo());

    Long vendedorId = request.sellerId();
    if (vendedorId != null) {
      Vendedor vendedor = vendedorService.findByUsuarioId(vendedorId)
          .orElseThrow(() -> new IllegalArgumentException("Vendedor no existe id=" + vendedorId));
      changes.setVendedor(vendedor);
    }

    Producto updated = productoService.update(id, changes, request.categoryIds());
    return ResponseEntity.ok(ProductoMapper.toDto(updated));
  }
}
