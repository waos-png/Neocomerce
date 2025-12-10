package com.neocommerce.repository;

import com.neocommerce.entity.ProductCategory;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductCategoryRepository extends JpaRepository<ProductCategory, Long> {
  List<ProductCategory> findByNameContainingIgnoreCase(String name);
}
