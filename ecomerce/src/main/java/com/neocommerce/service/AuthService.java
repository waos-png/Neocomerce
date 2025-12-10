package com.neocommerce.service;

import com.neocommerce.dto.auth.RegisterRequest;
import com.neocommerce.entity.Usuario;
import com.neocommerce.entity.Usuario.Rol;
import com.neocommerce.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final VendedorService vendedorService;

    /** Registra desde DTO de request usando las mismas validaciones */
    public Usuario register(RegisterRequest request) {
        if (request == null) throw new IllegalArgumentException("Request vacía");

        Usuario usuario = new Usuario();
        usuario.setDocumentNumber(request.documentNumber());

        if (request.documentType() != null) {
            usuario.setDocumentType(Usuario.DocumentType.valueOf(request.documentType()));
        }

        usuario.setUsername(request.username());
        usuario.setCellphone(request.cellphone());
        usuario.setEmail(request.email());

        if (request.gender() != null) {
            usuario.setGender(Usuario.Gender.valueOf(request.gender()));
        }

        usuario.setAge(request.age());

        // Convertir String rol a Enum si viene, o dejar null para default
        if (request.rol() != null) {
            usuario.setRol(Usuario.Rol.valueOf(request.rol()));
        } else {
            usuario.setRol(null);
        }

        return register(usuario, request.password());
    }

    /** Registra un usuario con validaciones */
    public Usuario register(Usuario usuario, String rawPassword) {

        if (usuario.getEmail() == null || usuario.getEmail().isBlank()) {
            throw new IllegalArgumentException("El email es obligatorio");
        }

        // Normalizar email
        String normalizedEmail = usuario.getEmail().trim().toLowerCase();

        if (!normalizedEmail.matches("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$")) {
            throw new IllegalArgumentException("Formato de email inválido");
        }

        usuario.setEmail(normalizedEmail);

        // Validación de contraseña fuerte
        validatePassword(rawPassword);

        // Validación de unicidad
        ensureUnique(normalizedEmail, usuario.getDocumentNumber());

        // ----- ASIGNAR ROL CORRECTAMENTE -----
        Rol rolFinal = determineRole(usuario.getRol());
        usuario.setRol(rolFinal);
        // -------------------------------------

        usuario.setId(null); // forzar creación
        usuario.setPassword(passwordEncoder.encode(rawPassword));
        usuario.setActivo(Boolean.TRUE);

        Usuario created = usuarioRepository.save(usuario);

        // Crear automáticamente el perfil de vendedor si corresponde
        if (created.getRol() == Rol.VENDEDOR) {
            vendedorService.createFromUsuario(created);
        }

        return created;
    }

    /**
     * Determina el rol real que debe asignarse al usuario.
     * - Si el JSON manda null → CLIENTE
     * - Si manda ADMIN → NO PERMITIDO
     * - Si manda VENDEDOR → OK
     */
    private Rol determineRole(Rol rolEnviado) {
        if (rolEnviado == null) {
            return Rol.CLIENTE;
        }

        if (rolEnviado == Rol.ADMIN) {
            throw new IllegalArgumentException("No está permitido crear usuarios ADMIN mediante registro");
        }

        // Aceptamos CLIENTE o VENDEDOR
        return rolEnviado;
    }

    /** Login con validación de usuario activo */
    public Usuario login(String email, String rawPassword) {

        if (email == null || rawPassword == null) {
            throw new IllegalArgumentException("Credenciales inválidas");
        }

        String normalizedEmail = email.trim().toLowerCase();

        Usuario user = usuarioRepository.findByEmailIgnoreCase(normalizedEmail)
                .orElseThrow(() -> new IllegalArgumentException("Credenciales inválidas"));

        if (!Boolean.TRUE.equals(user.getActivo())) {
            throw new IllegalArgumentException("Usuario inactivo");
        }

        if (!passwordEncoder.matches(rawPassword, user.getPassword())) {
            throw new IllegalArgumentException("Credenciales inválidas");
        }

        return user;
    }

    /** Cambia la contraseña de un usuario */
    public void changePassword(Long userId, String rawPassword) {

        validatePassword(rawPassword);

        Usuario user = usuarioRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado id=" + userId));

        user.setPassword(passwordEncoder.encode(rawPassword));
        usuarioRepository.save(user);
    }

    /** Validación de unicidad */
    private void ensureUnique(String email, Long documentNumber) {

        usuarioRepository.findByEmailIgnoreCase(email)
                .ifPresent(u -> { throw new IllegalArgumentException("El email ya está en uso"); });

        if (documentNumber != null) {
            usuarioRepository.findByDocumentNumber(documentNumber)
                    .ifPresent(u -> { throw new IllegalArgumentException("El documento ya está en uso"); });
        }
    }

    /** Validación de contraseña fuerte */
    private void validatePassword(String rawPassword) {
        if (rawPassword == null ||
            rawPassword.length() < 8 ||
            !rawPassword.matches(".*[A-Z].*")) {

            throw new IllegalArgumentException("La contraseña debe tener al menos 8 caracteres y una mayúscula");
        }

        if (!rawPassword.matches(".*[a-z].*")) {
            throw new IllegalArgumentException("Debe incluir al menos una minúscula");
        }

        if (!rawPassword.matches(".*\\d.*")) {
            throw new IllegalArgumentException("Debe incluir al menos un número");
        }

        if (!rawPassword.matches(".*[@$!%*?&].*")) {
            throw new IllegalArgumentException("Debe incluir un caracter especial");
        }
    }
}
