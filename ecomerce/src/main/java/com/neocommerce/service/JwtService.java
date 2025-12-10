package com.neocommerce.service;

import com.neocommerce.entity.Usuario;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.UnsupportedJwtException;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.security.SecurityException;
import java.security.Key;
import java.util.Base64;
import java.util.Date;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class JwtService {

  @Value("${jwt.secret}")
  private String secret;

  @Value("${jwt.expiration-ms}")
  private long expirationMs;

  private Key getSigningKey() {
    byte[] keyBytes = Base64.getDecoder().decode(secret);
    return Keys.hmacShaKeyFor(keyBytes);
  }

  /** Genera un JWT con expiración y claims básicos. */
  public String generateToken(Usuario usuario) {
    return Jwts.builder()
        .setSubject(usuario.getEmail())
        .claim("id", usuario.getId())
        .claim("rol", usuario.getRol().name())
        .setIssuedAt(new Date())
        .setExpiration(new Date(System.currentTimeMillis() + expirationMs))
        .signWith(getSigningKey(), SignatureAlgorithm.HS256)
        .compact();
  }

  /** Valida si el token es válido (firma y expiración). */
  public boolean isTokenValid(String token) {
    try {
      extractAllClaims(token);
      return true;
    } catch (ExpiredJwtException | SecurityException | MalformedJwtException |
             UnsupportedJwtException | IllegalArgumentException e) {
      return false;
    }
  }

  /** Extrae el email (subject) del token. */
  public String extractEmail(String token) {
    return extractAllClaims(token).getSubject();
  }

  /** Extrae todos los claims; lanza ExpiredJwtException si expira. */
  private Claims extractAllClaims(String token) {
    if (token == null || token.isBlank()) {
      throw new IllegalArgumentException("Token vacío");
    }
    return Jwts.parserBuilder()
        .setSigningKey(getSigningKey())
        .build()
        .parseClaimsJws(token)
        .getBody();
  }
}
