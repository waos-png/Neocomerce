"use client";
import React, { useState, useEffect } from "react";
import { Order } from "../../types/user";
import { IconLoader2, IconAlertCircle, IconCheck } from "@tabler/icons-react";
import { fetchOrdersHistory } from "../../lib/userApi";

function formatCOP(value: number) {
  return value.toLocaleString("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  });
}

interface OrderListProps {
  showToggleButton?: boolean;
  showInitially?: boolean;
}

export function OrderList({ showToggleButton = true, showInitially = false }: OrderListProps) {
  const [showHistory, setShowHistory] = useState(showInitially);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (showHistory) {
      fetchOrders();
    }
  }, [showHistory]);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchOrdersHistory();
      setOrders(Array.isArray(data) ? data : data.orders || []);
    } catch (err:any) {
      setError(err.message || "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-red-700">Historial de Compras</h2>
          <p className="text-sm text-gray-600 mt-1">
            Aquí puedes ver el resumen de tus compras recientes.
          </p>
        </div>
        {showToggleButton && (
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-red-500 transform hover:scale-105 transition-all"
          >
            {showHistory ? "Ocultar" : "Mostrar"}
          </button>
        )}
      </div>

      {showHistory && (
        <>
          {loading && (
            <div className="flex items-center justify-center py-8">
              <IconLoader2 size={32} className="text-red-600 animate-spin mr-3" />
              <p className="text-gray-600 font-semibold">Cargando historial...</p>
            </div>
          )}

          {error && (
            <div className="flex items-center gap-3 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200">
              <IconAlertCircle size={20} />
              {error}
            </div>
          )}

          {!loading && !error && (
            <ul className="divide-y divide-gray-200">
              {orders.length === 0 && (
                <li className="py-8 text-center text-gray-500">
                  No hay compras registradas.
                </li>
              )}
              {orders.map((order, index) => (
                <li
                  key={index}
                  className="py-4 px-4 hover:bg-red-50 rounded-md transition-colors duration-200 flex justify-between items-center"
                >
                  <div>
                    <p className="font-semibold text-gray-900">
                      {order.details || order.product_name || "Producto"}
                    </p>
                    <p className="text-sm text-gray-500">
                      {order.date || order.created_at || "Fecha no disponible"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">
                      {formatCOP(order.total || order.price || 0)}
                    </p>
                    <div className="flex items-center gap-1 mt-1">
                      {(order.status === "Completado" || order.status === "completed") && (
                        <IconCheck size={16} className="text-green-600" />
                      )}
                      <p className={`text-sm font-semibold ${
                        order.status === "Completado" || order.status === "completed"
                          ? "text-green-600"
                          : "text-yellow-600"
                      }`}>
                        {order.status || "Pendiente"}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
}