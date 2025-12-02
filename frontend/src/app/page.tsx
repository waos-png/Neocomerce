// Página principal del e-commerce (Home)
"use client";
import React from "react";
import FeaturemainSection from "@/app/components/main";

export default function Home() {
  return (
    <FeaturemainSection
      features={[
        {
          title: "Catálogo de Productos",
          description: "Explora una amplia variedad de productos de diferentes categorías, con imágenes, descripciones y precios actualizados."
        },
        {
          title: "Carrito de Compras",
          description: "Agrega productos a tu carrito, modifica cantidades y revisa el total antes de realizar tu compra de forma sencilla."
        },
        {
          title: "Pagos Seguros",
          description: "Realiza pagos de manera segura con múltiples métodos de pago y protección de datos."
        }
      ]}
    />
  );
}