"use client";
import React, { useState } from "react";
import Swal from "sweetalert2";
import { useCarrito } from "@/app/context/CartContext";
import * as userApi from "@/app/user/lib/userApi";

interface CheckoutModalProps {
  open: boolean;
  onClose: () => void;
}

export default function CheckoutModal({ open, onClose }: CheckoutModalProps) {
  const { carrito, total, vaciarCarrito } = useCarrito();
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const handleConfirm = async () => {
    if (!carrito || carrito.length === 0) {
      Swal.fire({ icon: "info", title: "Carrito vacío", text: "No hay productos en el carrito." });
      return;
    }
    setLoading(true);
    try {
      const items = carrito.map(item => ({ productId: item.productId, quantity: item.quantity }));
      const resp = await userApi.createOrder(items);
      Swal.fire({
        icon: "success",
        title: "Pedido creado",
        text: "Su pedido fue creado correctamente.",
        timer: 1800,
        showConfirmButton: false
      });
      // Vaciar carrito en frontend y backend
      await vaciarCarrito();
      onClose();
    } catch (err: any) {
      Swal.fire({ icon: "error", title: "Error", text: err?.message || "No se pudo crear el pedido" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[1050] flex items-center justify-center">
      <div className="fixed inset-0 bg-black/40" onClick={onClose} />
      <div className="bg-white rounded-lg shadow-lg z-[1060] w-[90%] max-w-xl p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Confirmar pedido</h3>

        <div className="max-h-64 overflow-auto mb-4">
          {carrito.map((it) => (
            <div key={it.id} className="flex justify-between items-center py-2 border-b last:border-b-0">
              <div>
                <div className="font-semibold text-gray-900">{it.productName}</div>
                <div className="text-sm text-gray-500">x{it.quantity}</div>
              </div>
              <div className="text-right">
                <div className="font-bold text-gray-900">${it.subtotal?.toLocaleString?.('es-ES') ?? it.subtotal}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center mb-4">
          <span className="text-gray-700 font-semibold">Total</span>
          <span className="text-2xl font-black text-red-600">${total?.toLocaleString?.('es-ES') ?? total}</span>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2 px-4 bg-gray-100 hover:bg-gray-200 rounded-lg"
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 py-2 px-4 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold"
            disabled={loading}
          >
            {loading ? "Procesando..." : "Confirmar pedido"}
          </button>
        </div>
      </div>
    </div>
  );
}