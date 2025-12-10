package com.neocommerce.controller;

import com.neocommerce.dto.auth.AuthResponse;
import com.neocommerce.dto.auth.LoginRequest;
import com.neocommerce.dto.auth.RegisterRequest;
import com.neocommerce.entity.Usuario;
import com.neocommerce.service.AuthService;
import com.neocommerce.service.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

  private final AuthService authService;
  private final JwtService jwtService;

  @PostMapping("/register")
  public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest request) {

    Usuario usuario = new Usuario();
    usuario.setDocumentNumber(request.documentNumber());
    usuario.setDocumentType(parseEnum(Usuario.DocumentType.class, request.documentType(), "document_type"));
    usuario.setUsername(request.username());
    usuario.setCellphone(request.cellphone());
    usuario.setEmail(request.email());
    usuario.setGender(parseEnum(Usuario.Gender.class, request.gender(), "gender"));
    usuario.setAge(request.age());
    Usuario.Rol rol = parseEnum(Usuario.Rol.class, request.rol(), "rol");

    usuario.setRol(rol);

    Usuario created = authService.register(usuario, request.password());
    String token = jwtService.generateToken(created);

    return ResponseEntity.ok(
        new AuthResponse(
            created.getId(),
            created.getEmail(),
            created.getUsername(),
            created.getRol().name(),
            token
        )
    );
  }

  @PostMapping("/login")
  public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
    Usuario user = authService.login(request.email(), request.password());
    String token = jwtService.generateToken(user);

    return ResponseEntity.ok(
        new AuthResponse(
            user.getId(),
            user.getEmail(),
            user.getUsername(),
            user.getRol().name(),
            token
        )
    );
  }

  private <E extends Enum<E>> E parseEnum(Class<E> enumClass, String value, String fieldName) {
    if (value == null) return null;
    try {
      return Enum.valueOf(enumClass, value);
    } catch (IllegalArgumentException ex) {
      throw new IllegalArgumentException("Valor inválido para " + fieldName + ": " + value);
    }
  }
}
