package com.neocommerce.repository;

import com.neocommerce.entity.Producto;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductoRepository extends JpaRepository<Producto, Long> {

  List<Producto> findByProductNameContainingIgnoreCaseOrDescriptionContainingIgnoreCase(String name, String description);

  List<Producto> findByVendedorId(Long vendedorId);

  List<Producto> findByCategorias_Id(Long categoryId);

  List<Producto> findByCategorias_IdAndProductNameContainingIgnoreCase(Long categoryId, String name);

  List<Producto> findAllByOrderByCreadoEnDesc();

  List<Producto> findAllByOrderByPriceAsc();

  List<Producto> findByVendedorIdAndActivoTrue(Long vendedorId);

  List<Producto> findByActivoTrue();
}
