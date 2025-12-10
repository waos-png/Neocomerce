package com.neocommerce.dto.vendedor;

public record VendedorRequest(
    Long usuarioId,
    String nombreTienda,
    String nitORfc,
    String telefono,
    String direccion,
    String ciudad,
    String pais,
    Boolean verificado
) {}
