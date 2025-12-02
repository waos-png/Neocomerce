"use client";
import React from "react";
import Carrito from "./cart";

// --- Página dedicada al carrito ---
const CarritoPage: React.FC = () => {
  return (
    <main className="min-h-screen flex flex-col items-center justify-start bg-gray-50 py-10">
      <Carrito />
    </main>
  );
};

export default CarritoPage;