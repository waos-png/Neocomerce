package com.neocommerce.dto.vendedor;

public record VendedorUpdateRequest(
    String nombreTienda,
    String nitORfc,
    String telefono,
    String direccion,
    String ciudad,
    String pais,
    Boolean verificado
) {}
