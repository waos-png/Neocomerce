package com.neocommerce.mapper;

import com.neocommerce.dto.producto.ProductoResponse;
import com.neocommerce.entity.ProductCategory;
import com.neocommerce.entity.Producto;
import com.neocommerce.entity.Vendedor;
import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

public final class ProductoMapper {

  private ProductoMapper() {}

  public static ProductoResponse toDto(Producto producto) {
    if (producto == null) return null;

    ProductoResponse.VendedorMini vendedorMini = toVendedorMini(producto.getVendedor());
    List<ProductoResponse.CategoriaMini> categorias = toCategoriasMini(producto.getCategorias());

    return new ProductoResponse(
        producto.getId(),
        producto.getProductName(),
        producto.getDescription(),
        producto.getPrice(),
        producto.getImageUrl(),
        producto.getRating(),
        producto.getStock(),
        producto.getActivo(),
        vendedorMini,
        categorias,
        producto.getCreadoEn(),
        producto.getActualizadoEn()
    );
  }

  private static ProductoResponse.VendedorMini toVendedorMini(Vendedor vendedor) {
    if (vendedor == null) return null;
    return new ProductoResponse.VendedorMini(
        vendedor.getId(),
        vendedor.getNombreTienda(),
        vendedor.getVerificado()
    );
  }

  private static List<ProductoResponse.CategoriaMini> toCategoriasMini(Set<ProductCategory> categorias) {
    if (categorias == null) return List.of();
    return categorias.stream()
        .filter(Objects::nonNull)
        .map(cat -> new ProductoResponse.CategoriaMini(
            cat.getId(),
            cat.getName(),
            cat.getType() != null ? cat.getType().name() : null,
            cat.getClassification() != null ? cat.getClassification().name() : null
        ))
        .collect(Collectors.toList());
  }
}
