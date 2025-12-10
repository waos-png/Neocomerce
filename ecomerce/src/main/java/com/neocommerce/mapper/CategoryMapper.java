package com.neocommerce.mapper;

import com.neocommerce.dto.categoria.CategoryRequest;
import com.neocommerce.dto.categoria.CategoryResponse;
import com.neocommerce.entity.ProductCategory;

public final class CategoryMapper {

  private CategoryMapper() {}

  public static CategoryResponse toDto(ProductCategory category) {
    if (category == null) return null;
    return new CategoryResponse(
        category.getId(),
        category.getName(),
        category.getType() != null ? category.getType().name() : null,
        category.getClassification() != null ? category.getClassification().name() : null
    );
  }

  public static ProductCategory toEntity(CategoryRequest request) {
    if (request == null) return null;
    ProductCategory category = new ProductCategory();
    category.setName(request.name());
    category.setType(parseEnum(ProductCategory.CategoryType.class, request.type(), "type"));
    category.setClassification(parseEnum(ProductCategory.Classification.class, request.classification(), "classification"));
    return category;
  }

  private static <E extends Enum<E>> E parseEnum(Class<E> enumClass, String value, String fieldName) {
    if (value == null) return null;
    try {
      return Enum.valueOf(enumClass, value);
    } catch (IllegalArgumentException ex) {
      throw new IllegalArgumentException("Valor inválido para " + fieldName + ": " + value);
    }
  }
}
