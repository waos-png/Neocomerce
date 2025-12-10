package com.neocommerce.controller;

import com.neocommerce.dto.pedido.PedidoRequest;
import com.neocommerce.dto.pedido.PedidoResponse;
import com.neocommerce.entity.Pedido;
import com.neocommerce.entity.PedidoItem;
import com.neocommerce.entity.Producto;
import com.neocommerce.service.PedidoService;
import com.neocommerce.service.ProductoService;
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
@RequestMapping("/pedidos")
@RequiredArgsConstructor
public class PedidoController {

    private final PedidoService pedidoService;
    private final ProductoService productoService;

    @GetMapping
    public ResponseEntity<List<PedidoResponse>> listByUsuario(@RequestParam("usuarioId") Long usuarioId) {
        List<PedidoResponse> result = pedidoService.findByUsuario(usuarioId).stream()
                .map(this::toDto)
                .toList();
        return ResponseEntity.ok(result);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PedidoResponse> get(@PathVariable Long id) {
        return ResponseEntity.ok(toDto(pedidoService.findByIdOrThrow(id)));
    }

    @PostMapping
    public ResponseEntity<PedidoResponse> create(@RequestBody PedidoRequest request) {

        List<PedidoItem> items = request.items().stream()
                .map(this::toEntity)
                .toList();

        Pedido created = pedidoService.createPedido(request.usuarioId(), items);
        return ResponseEntity.ok(toDto(created));
    }

    @PutMapping("/{id}/estado")
    public ResponseEntity<PedidoResponse> updateEstado(
            @PathVariable Long id,
            @RequestParam("estado") Pedido.Estado estado
    ) {
        Pedido updated = pedidoService.updateEstado(id, estado);
        return ResponseEntity.ok(toDto(updated));
    }

    // Helpers internos
    private PedidoItem toEntity(PedidoRequest.ItemRequest req) {

        Producto producto = productoService.findById(req.productId())
                .orElseThrow(() -> new IllegalArgumentException("Producto no encontrado id=" + req.productId()));

        PedidoItem item = new PedidoItem();
        item.setProducto(producto);
        item.setQuantity(req.quantity());
        item.setPrice(producto.getPrice()); // precio real desde la BD

        return item;
    }

    private PedidoResponse toDto(Pedido pedido) {
        return new PedidoResponse(
                pedido.getId(),
                pedido.getUsuario() != null ? pedido.getUsuario().getId() : null,
                pedido.getEstado(),
                pedido.getTotal(),
                pedido.getFecha(),
                pedido.getActualizadoEn(),
                pedido.getItems().stream().map(item ->
                        new PedidoResponse.ItemResponse(
                                item.getId(),
                                item.getProducto() != null ? item.getProducto().getId() : null,
                                item.getProducto() != null ? item.getProducto().getProductName() : null,
                                item.getQuantity(),
                                item.getPrice(),
                                item.getSubtotal()
                        )
                ).toList()
        );
    }
}
