"use client";
import React from "react";
import { useCarrito } from "../context/CartContext";
import { IconShoppingCart, IconTrash, IconCreditCard } from "@tabler/icons-react";
import { FaShoppingBag } from "react-icons/fa";

// --- Componente visual del carrito ---
const Carrito: React.FC = () => {
  const { carrito, quitarDelCarrito, total, vaciarCarrito, loading } = useCarrito();

  return (
    <section className="w-full max-w-xl mx-auto bg-white rounded-2xl shadow-xl p-8 border border-fuchsia-100 mt-24">
      <h2 className="text-3xl font-bold mb-6 text-fuchsia-700 flex items-center gap-3">
        <span className="inline-flex items-center justify-center bg-fuchsia-100 rounded-full p-2">
          <IconShoppingCart size={32} className="text-fuchsia-600" />
        </span>
        Tu carrito
      </h2>
      {loading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <span className="text-lg text-fuchsia-400">Cargando...</span>
        </div>
      ) : carrito.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12">
          <span className="text-5xl mb-4 text-fuchsia-200">
            <FaShoppingBag />
          </span>
          <p className="text-gray-500 text-lg">No hay productos en el carrito.</p>
        </div>
      ) : (
        <>
          <ul className="divide-y divide-fuchsia-100 mb-6">
            {carrito.map((producto) => (
              <li key={producto.id} className="flex items-center justify-between py-4">
                <div>
                  <span className="block text-lg font-semibold text-gray-800">{producto.nombre}</span>
                  <span className="block text-fuchsia-600 font-bold">
                    ${producto.precio} x {producto.cantidad}
                  </span>
                </div>
                <button
                  className="ml-4 flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-fuchsia-500 to-orange-400 text-white rounded-xl shadow hover:from-fuchsia-600 hover:to-orange-500 transition font-semibold"
                  onClick={() => quitarDelCarrito(producto.id)}
                  title="Quitar del carrito"
                >
                  <IconTrash size={20} />
                  Quitar
                </button>
              </li>
            ))}
          </ul>
          <div className="flex items-center justify-between border-t border-fuchsia-100 pt-4">
            <span className="text-lg font-bold text-gray-700">Total:</span>
            <span className="text-2xl font-extrabold text-fuchsia-700">${total}</span>
          </div>
          <div className="flex gap-2 mt-6">
            <button
              className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-fuchsia-600 via-fuchsia-400 to-orange-400 hover:from-fuchsia-700 hover:to-orange-500 text-white font-bold rounded-2xl shadow-xl transition-all text-lg"
              disabled={carrito.length === 0}
            >
              <IconCreditCard size={22} />
              Finalizar compra
            </button>
            <button
              className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-gray-300 to-gray-400 hover:from-gray-400 hover:to-gray-500 text-gray-700 font-bold rounded-2xl shadow-xl transition-all text-lg"
              onClick={vaciarCarrito}
              disabled={carrito.length === 0}
              title="Vaciar carrito"
            >
              <IconTrash size={20} />
              Vaciar
            </button>
          </div>
        </>
      )}
    </section>
  );
};

export default Carrito;
