package com.neocommerce.service;

import com.neocommerce.entity.ProductCategory;
import com.neocommerce.entity.ProductCategory.CategoryType;
import com.neocommerce.entity.ProductCategory.Classification;
import com.neocommerce.repository.ProductCategoryRepository;
import java.util.List;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CategoriaService {

  private final ProductCategoryRepository categoryRepository;

  public List<ProductCategory> findAll() {
    return categoryRepository.findAll();
  }

  public Optional<ProductCategory> findById(Long id) {
    return categoryRepository.findById(id);
  }

  public List<ProductCategory> findByName(String name) {
    return categoryRepository.findByNameContainingIgnoreCase(name);
  }

  public ProductCategory create(ProductCategory category) {
    category.setId(null);
    validateEnums(category);
    return categoryRepository.save(category);
  }

  public ProductCategory update(Long id, ProductCategory changes) {
    ProductCategory existing = categoryRepository.findById(id)
        .orElseThrow(() -> new IllegalArgumentException("Categoría no encontrada id=" + id));

    if (changes.getName() != null) existing.setName(changes.getName());
    if (changes.getType() != null) existing.setType(changes.getType());
    if (changes.getClassification() != null) existing.setClassification(changes.getClassification());

    validateEnums(existing);
    return categoryRepository.save(existing);
  }

  private void validateEnums(ProductCategory category) {
    if (category.getType() != null && !isValidEnum(CategoryType.class, category.getType().name())) {
      throw new IllegalArgumentException("Tipo de categoría inválido");
    }
    if (category.getClassification() != null &&
        !isValidEnum(Classification.class, category.getClassification().name())) {
      throw new IllegalArgumentException("Clasificación de categoría inválida");
    }
  }

  private <E extends Enum<E>> boolean isValidEnum(Class<E> enumClass, String value) {
    try {
      Enum.valueOf(enumClass, value);
      return true;
    } catch (IllegalArgumentException ex) {
      return false;
    }
  }
}
