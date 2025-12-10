package com.neocommerce.controller;

import com.neocommerce.dto.categoria.CategoryRequest;
import com.neocommerce.dto.categoria.CategoryResponse;
import com.neocommerce.entity.ProductCategory;
import com.neocommerce.mapper.CategoryMapper;
import com.neocommerce.service.CategoriaService;
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
@RequestMapping("/categories")
@RequiredArgsConstructor
public class CategoriaController {

  private final CategoriaService categoriaService;

  @GetMapping
  public ResponseEntity<List<CategoryResponse>> list(
      @RequestParam(value = "q", required = false) String q) {

    List<ProductCategory> result = (q == null || q.isBlank())
        ? categoriaService.findAll()
        : categoriaService.findByName(q);

    return ResponseEntity.ok(
        result.stream().map(CategoryMapper::toDto).toList()
    );
  }

  @GetMapping("/{id}")
  public ResponseEntity<CategoryResponse> get(@PathVariable Long id) {
    return categoriaService.findById(id)
        .map(CategoryMapper::toDto)
        .map(ResponseEntity::ok)
        .orElse(ResponseEntity.notFound().build());
  }

  @PostMapping
  public ResponseEntity<CategoryResponse> create(@RequestBody CategoryRequest request) {
    ProductCategory created = categoriaService.create(CategoryMapper.toEntity(request));
    return ResponseEntity.ok(CategoryMapper.toDto(created));
  }

  @PutMapping("/{id}")
  public ResponseEntity<CategoryResponse> update(
      @PathVariable Long id,
      @RequestBody CategoryRequest request) {

    ProductCategory updated = categoriaService.update(id, CategoryMapper.toEntity(request));
    return ResponseEntity.ok(CategoryMapper.toDto(updated));
  }
}
