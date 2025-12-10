package com.neocommerce.controller;

import com.neocommerce.dto.usuario.UsuarioResponse;
import com.neocommerce.dto.usuario.UsuarioUpdateRequest;
import com.neocommerce.entity.Usuario;
import com.neocommerce.mapper.UsuarioMapper;
import com.neocommerce.service.UsuarioService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/usuarios")
@RequiredArgsConstructor
public class UsuarioController {

  private final UsuarioService usuarioService;

  @GetMapping
  public ResponseEntity<List<UsuarioResponse>> list() {
    List<UsuarioResponse> result = usuarioService.findAll().stream()
        .map(UsuarioMapper::toDto)
        .toList();

    return ResponseEntity.ok(result);
  }

  @GetMapping("/{id}")
  public ResponseEntity<UsuarioResponse> get(@PathVariable Long id) {
    return usuarioService.findById(id)
        .map(UsuarioMapper::toDto)
        .map(ResponseEntity::ok)
        .orElse(ResponseEntity.notFound().build());
  }

  @PutMapping("/{id}")
  public ResponseEntity<UsuarioResponse> update(
      @PathVariable Long id,
      @RequestBody UsuarioUpdateRequest body
  ) {
    Usuario changes = new Usuario();
    changes.setUsername(body.username());
    changes.setCellphone(body.cellphone());
    changes.setGender(body.gender() != null ? Usuario.Gender.valueOf(body.gender()) : null);
    changes.setAge(body.age());

    Usuario updated = usuarioService.update(id, changes);
    return ResponseEntity.ok(UsuarioMapper.toDto(updated));
  }
}
