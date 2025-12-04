"use client";
import React from "react";
import { useCarrito } from "../context/CartContext";
import { IconShoppingCart, IconTrash, IconCreditCard, IconLoader2 } from "@tabler/icons-react";

// --- Componente visual del carrito ---
const Carrito: React.FC = () => {
  const { carrito, quitarDelCarrito, total, vaciarCarrito, loading } = useCarrito();

  return (
    <section className="w-full max-w-4xl mx-auto">
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 bg-white rounded-2xl shadow-lg border border-gray-100">
          <IconLoader2 size={48} className="text-red-600 animate-spin mb-4" />
          <span className="text-lg font-semibold text-gray-600">Cargando carrito...</span>
        </div>
      ) : carrito.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 bg-white rounded-2xl shadow-lg border border-gray-100">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
            <IconShoppingCart size={40} className="text-red-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Carrito vacío</h3>
          <p className="text-gray-600 text-center max-w-sm">
            No hay productos en tu carrito. ¡Agrega algunos productos para continuar!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Lista de productos */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-2xl font-black text-gray-900 flex items-center gap-3">
                  <span className="inline-flex items-center justify-center bg-red-100 rounded-lg p-2">
                    <IconShoppingCart size={28} className="text-red-600" />
                  </span>
                  Productos ({carrito.length})
                </h2>
              </div>
              
              <ul className="divide-y divide-gray-200">
                {carrito.map((producto) => (
                  <li key={producto.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex-1">
                        <span className="block text-lg font-bold text-gray-900 mb-2">
                          {producto.nombre}
                        </span>
                        <div className="flex items-center gap-4">
                          <span className="text-2xl font-black text-red-600">
                            ${producto.precio?.toLocaleString('es-ES') || '0'}
                          </span>
                          <span className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full font-semibold">
                            x{producto.cantidad}
                          </span>
                          <span className="text-gray-600 font-semibold">
                            = ${(producto.precio * producto.cantidad)?.toLocaleString('es-ES') || '0'}
                          </span>
                        </div>
                      </div>
                      
                      <button
                        className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors"
                        onClick={() => quitarDelCarrito(producto.id)}
                        title="Quitar del carrito"
                      >
                        <IconTrash size={20} />
                        <span className="hidden sm:inline">Quitar</span>
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Resumen de compra */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sticky top-32">
              <h3 className="text-xl font-black text-gray-900 mb-6">Resumen</h3>
              
              <div className="space-y-4 mb-6 pb-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-semibold text-gray-900">
                    ${total?.toLocaleString('es-ES') || '0'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Envío:</span>
                  <span className="font-semibold text-gray-900">Gratis</span>
                </div>
              </div>

              <div className="flex justify-between items-center mb-6 pb-6 border-b border-gray-200">
                <span className="text-lg font-bold text-gray-900">Total:</span>
                <span className="text-3xl font-black text-red-600">
                  ${total?.toLocaleString('es-ES') || '0'}
                </span>
              </div>

              <div className="flex flex-col gap-3">
                <button
                  className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all"
                  disabled={carrito.length === 0}
                >
                  <IconCreditCard size={22} />
                  Finalizar compra
                </button>
                <button
                  className="w-full flex items-center justify-center gap-2 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold rounded-xl transition-colors"
                  onClick={vaciarCarrito}
                  disabled={carrito.length === 0}
                  title="Vaciar carrito"
                >
                  <IconTrash size={20} />
                  Vaciar carrito
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Carrito;
