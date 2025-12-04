"use client";
import React from "react";
import { IconShoppingCart } from "@tabler/icons-react";
import Carrito from "./cart";

// --- Página dedicada al carrito ---
const CarritoPage: React.FC = () => {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50 pt-24">
      {/* Header del Carrito */}
      <div className="w-full bg-white border-b border-gray-200 shadow-sm mb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-red-50 to-red-100 rounded-xl">
              <IconShoppingCart size={32} className="text-red-600" stroke={2.5} />
            </div>
            <div>
              <h1 className="text-4xl sm:text-5xl font-black text-gray-900 mb-2">
                Tu Carrito
              </h1>
              <p className="text-gray-600 flex items-center gap-2">
                <span className="font-semibold text-red-600">Revisa</span>
                y completa tu compra
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido Principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <Carrito />
      </div>
    </main>
  );
};

export default CarritoPage;