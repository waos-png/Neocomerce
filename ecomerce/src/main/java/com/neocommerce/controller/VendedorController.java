package com.neocommerce.controller;

import com.neocommerce.dto.vendedor.VendedorRequest;
import com.neocommerce.dto.vendedor.VendedorResponse;
import com.neocommerce.dto.vendedor.VendedorUpdateRequest;
import com.neocommerce.entity.Usuario;
import com.neocommerce.entity.Vendedor;
import com.neocommerce.mapper.VendedorMapper;
import com.neocommerce.service.UsuarioService;
import com.neocommerce.service.VendedorService;
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
@RequestMapping("/vendedores")
@RequiredArgsConstructor
public class VendedorController {

    private final VendedorService vendedorService;
    private final UsuarioService usuarioService;

    @GetMapping("/by-user")
    public ResponseEntity<VendedorResponse> getByUsuario(@RequestParam("usuarioId") Long usuarioId) {
        return vendedorService.findByUsuarioId(usuarioId)
            .map(VendedorMapper::toDto)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<VendedorResponse> create(@RequestBody VendedorRequest request) {
        if (request.usuarioId() == null) {
            throw new IllegalArgumentException("usuarioId es requerido");
        }

        Usuario usuario = usuarioService.findById(request.usuarioId())
            .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado id=" + request.usuarioId()));

        Vendedor vendedor = VendedorMapper.toEntity(request, usuario);
        Vendedor created = vendedorService.create(vendedor);

        return ResponseEntity.ok(VendedorMapper.toDto(created));
    }

    @PutMapping("/{id}")
    public ResponseEntity<VendedorResponse> updatePerfil(
        @PathVariable Long id,
        @RequestBody VendedorUpdateRequest request
    ) {
        Vendedor vendedor = vendedorService.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Vendedor no encontrado id=" + id));

        VendedorMapper.applyUpdates(vendedor, request);
        Vendedor updated = vendedorService.updatePerfil(id, vendedor);

        return ResponseEntity.ok(VendedorMapper.toDto(updated));
    }

    @PutMapping("/{id}/verificado")
    public ResponseEntity<VendedorResponse> verify(
        @PathVariable Long id,
        @RequestParam("value") boolean value
    ) {
        Vendedor updated = vendedorService.updateVerificado(id, value);
        return ResponseEntity.ok(VendedorMapper.toDto(updated));
    }
}
