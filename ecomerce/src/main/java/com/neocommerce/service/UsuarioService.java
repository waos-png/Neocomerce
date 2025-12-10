package com.neocommerce.service;

import com.neocommerce.entity.Usuario;
import com.neocommerce.repository.UsuarioRepository;
import java.util.Objects;
import java.util.Optional;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UsuarioService {

  private final UsuarioRepository usuarioRepository;

  public Usuario create(Usuario usuario) {
    // forzamos alta
    usuario.setId(null);
    ensureUnique(usuario, null);
    return usuarioRepository.save(usuario);
  }

  public Usuario update(Long id, Usuario changes) {
    Usuario existing = loadOrThrow(id);

    // email
    if (changes.getEmail() != null && !changes.getEmail().equalsIgnoreCase(existing.getEmail())) {
      ensureEmailUnique(changes.getEmail(), id);
      existing.setEmail(changes.getEmail());
    }
    // documento
    if (changes.getDocumentNumber() != null &&
        !Objects.equals(changes.getDocumentNumber(), existing.getDocumentNumber())) {
      ensureDocumentoUnique(changes.getDocumentNumber(), id);
      existing.setDocumentNumber(changes.getDocumentNumber());
    }
    // demás campos (solo si no vienen null)
    if (changes.getUsername() != null) existing.setUsername(changes.getUsername());
    if (changes.getCellphone() != null) existing.setCellphone(changes.getCellphone());
    if (changes.getPassword() != null) existing.setPassword(changes.getPassword()); // espera hash
    if (changes.getGender() != null) existing.setGender(changes.getGender());
    if (changes.getAge() != null) existing.setAge(changes.getAge());
    if (changes.getRol() != null) existing.setRol(changes.getRol());
    if (changes.getActivo() != null) existing.setActivo(changes.getActivo());

    return usuarioRepository.save(existing);
  }

  /** Borrado lógico: marca activo = false. */
  public void deleteLogical(Long id) {
    Usuario user = loadOrThrow(id);
    user.setActivo(false);
    usuarioRepository.save(user);
  }

  /** Busca por email (case-insensitive). */
  public Optional<Usuario> findByEmail(String email) {
    if (email == null) return Optional.empty();
    return usuarioRepository.findByEmailIgnoreCase(email.trim());
  }

  public Optional<Usuario> findById(Long id) {
    return usuarioRepository.findById(id);
  }


  /** Busca por id o lanza excepción. */
  public Usuario loadOrThrow(Long id) {
    return usuarioRepository.findById(id)
        .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado id=" + id));
  }

  public List<Usuario> findAll() {
    return usuarioRepository.findAll();
  }

  // --- helpers privados ---
  private void ensureUnique(Usuario usuario, Long currentId) {
    ensureEmailUnique(usuario.getEmail(), currentId);
    ensureDocumentoUnique(usuario.getDocumentNumber(), currentId);
  }

  private void ensureEmailUnique(String email, Long currentId) {
    if (email == null) return;
    Optional<Usuario> existing = usuarioRepository.findByEmailIgnoreCase(email);
    if (existing.isPresent() && !Objects.equals(existing.get().getId(), currentId)) {
      throw new IllegalArgumentException("El email ya está en uso");
    }
  }

  private void ensureDocumentoUnique(Long documentNumber, Long currentId) {
    if (documentNumber == null) return;
    Optional<Usuario> existing = usuarioRepository.findByDocumentNumber(documentNumber);
    if (existing.isPresent() && !Objects.equals(existing.get().getId(), currentId)) {
      throw new IllegalArgumentException("El documento ya está en uso");
    }
  }
}
