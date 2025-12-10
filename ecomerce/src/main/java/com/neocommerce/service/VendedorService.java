package com.neocommerce.service;

import com.neocommerce.entity.Usuario;
import com.neocommerce.entity.Vendedor;
import com.neocommerce.repository.UsuarioRepository;
import com.neocommerce.repository.VendedorRepository;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class VendedorService {

  private final VendedorRepository vendedorRepository;
  private final UsuarioRepository usuarioRepository;

  @Transactional
  public Vendedor create(Vendedor vendedor) {
    vendedor.setId(null);
    validateUsuario(vendedor.getUsuario());
    if (existsByUsuarioId(vendedor.getUsuario().getId())) {
      throw new IllegalArgumentException("Este usuario ya tiene perfil de vendedor.");
    }
    return vendedorRepository.save(vendedor);
  }

  public Optional<Vendedor> findByUsuarioId(Long usuarioId) {
    return vendedorRepository.findByUsuarioId(usuarioId);
  }

  public Optional<Vendedor> findById(Long id) {
    return vendedorRepository.findById(id);
  }

  public Optional<Vendedor> findByUsuarioEmail(String email) {
    return vendedorRepository.findByUsuario_EmailIgnoreCase(email);
  }

  public boolean existsByUsuarioId(Long usuarioId) {
    return vendedorRepository.existsByUsuarioId(usuarioId);
  }

  @Transactional
  public Vendedor updateVerificado(Long vendedorId, boolean verificado) {
    Vendedor vendedor = vendedorRepository.findById(vendedorId)
        .orElseThrow(() -> new IllegalArgumentException("Vendedor no encontrado id=" + vendedorId));
    vendedor.setVerificado(verificado);
    return vendedorRepository.save(vendedor);
  }

  @Transactional
  public Vendedor updatePerfil(Long vendedorId, Vendedor changes) {
    Vendedor vendedor = vendedorRepository.findById(vendedorId)
        .orElseThrow(() -> new IllegalArgumentException("Vendedor no encontrado id=" + vendedorId));

    if (changes.getNombreTienda() != null) vendedor.setNombreTienda(changes.getNombreTienda());
    if (changes.getNitORfc() != null) vendedor.setNitORfc(changes.getNitORfc());
    if (changes.getTelefono() != null) vendedor.setTelefono(changes.getTelefono());
    if (changes.getDireccion() != null) vendedor.setDireccion(changes.getDireccion());
    if (changes.getCiudad() != null) vendedor.setCiudad(changes.getCiudad());
    if (changes.getPais() != null) vendedor.setPais(changes.getPais());
    if (changes.getVerificado() != null) vendedor.setVerificado(changes.getVerificado());

    return vendedorRepository.save(vendedor);
  }

  /** Crea un perfil de vendedor a partir de un usuario existente. */
  @Transactional
  public Vendedor createFromUsuario(Usuario usuario) {
    validateUsuario(usuario);
    if (existsByUsuarioId(usuario.getId())) {
      throw new IllegalArgumentException("Este usuario ya tiene perfil de vendedor.");
    }
    Vendedor vendedor = new Vendedor();
    vendedor.setUsuario(usuario);
    return vendedorRepository.save(vendedor);
  }

  private void validateUsuario(Usuario usuario) {
    if (usuario == null || usuario.getId() == null) {
      throw new IllegalArgumentException("Debe asociar un usuario existente");
    }
    usuarioRepository.findById(usuario.getId())
        .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado id=" + usuario.getId()));
  }
}
