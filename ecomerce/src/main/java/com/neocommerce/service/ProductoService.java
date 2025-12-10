package com.neocommerce.service;

import com.neocommerce.entity.ProductCategory;
import com.neocommerce.entity.Producto;
import com.neocommerce.repository.ProductCategoryRepository;
import com.neocommerce.repository.ProductoRepository;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ProductoService {

  private final ProductoRepository productoRepository;
  private final ProductCategoryRepository categoryRepository;

  public Optional<Producto> findById(Long id) {
    return productoRepository.findById(id);
  }

  public List<Producto> findAll() {
    return productoRepository.findAll();
  }

  public List<Producto> findAllActivos() {
    return productoRepository.findByActivoTrue();
  }

  public List<Producto> search(String term) {
    return productoRepository
        .findByProductNameContainingIgnoreCaseOrDescriptionContainingIgnoreCase(term, term);
  }

  public List<Producto> findByCategoria(Long categoriaId) {
    return productoRepository.findByCategorias_Id(categoriaId);
  }

  public List<Producto> findByCategoriaAndNombre(Long categoriaId, String term) {
    return productoRepository.findByCategorias_IdAndProductNameContainingIgnoreCase(categoriaId, term);
  }

  public List<Producto> findRecientes() {
    return productoRepository.findAllByOrderByCreadoEnDesc();
  }

  public List<Producto> findByPrecioAsc() {
    return productoRepository.findAllByOrderByPriceAsc();
  }

  public List<Producto> findByVendedorActivo(Long vendedorId) {
    return productoRepository.findByVendedorIdAndActivoTrue(vendedorId);
  }

  @Transactional
  public Producto create(Producto producto, Set<Long> categoryIds) {
    producto.setId(null);
    attachCategories(producto, categoryIds);
    return productoRepository.save(producto);
  }

  @Transactional
  public Producto update(Long id, Producto changes, Set<Long> categoryIds) {
    Producto existing = productoRepository.findById(id)
        .orElseThrow(() -> new IllegalArgumentException("Producto no encontrado id=" + id));

    if (changes.getProductName() != null) existing.setProductName(changes.getProductName());
    if (changes.getDescription() != null) existing.setDescription(changes.getDescription());
    if (changes.getPrice() != null) existing.setPrice(changes.getPrice());
    if (changes.getImageUrl() != null) existing.setImageUrl(changes.getImageUrl());
    if (changes.getRating() != null) existing.setRating(changes.getRating());
    if (changes.getStock() != null) existing.setStock(changes.getStock());
    if (changes.getVendedor() != null) existing.setVendedor(changes.getVendedor());
    if (changes.getActivo() != null) existing.setActivo(changes.getActivo());

    if (categoryIds != null) {
      attachCategories(existing, categoryIds);
    }

    return productoRepository.save(existing);
  }

  /** Borrado lógico: marca activo=false. */
  @Transactional
  public void deactivate(Long id) {
    Producto producto = productoRepository.findById(id)
        .orElseThrow(() -> new IllegalArgumentException("Producto no encontrado id=" + id));
    producto.setActivo(Boolean.FALSE);
    productoRepository.save(producto);
  }

  private void attachCategories(Producto producto, Set<Long> categoryIds) {
    if (categoryIds == null) {
      return;
    }
    List<ProductCategory> cats = categoryRepository.findAllById(categoryIds);
    producto.getCategorias().clear();
    producto.getCategorias().addAll(cats);
  }
}
