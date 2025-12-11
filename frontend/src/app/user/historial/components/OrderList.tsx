"use client";
import React, { useState, useEffect } from "react";
import { Order } from "../../types/user";
import { IconLoader2, IconAlertCircle, IconCheck, IconClock, IconBox } from "@tabler/icons-react";
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
    } catch (err: any) {
      setError(err.message || "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-white rounded-xl shadow-md border border-gray-100">
      <div className="px-6 py-6 border-b border-gray-100 flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-black text-gray-900 flex items-center gap-3">
            <IconBox size={28} className="text-red-600" />
            Historial de Compras
          </h2>
          <p className="text-sm text-gray-600 mt-2">
            Revisa el estado de tus pedidos anteriores
          </p>
        </div>
        {showToggleButton && (
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="px-6 py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold rounded-lg shadow-md transition-all"
          >
            {showHistory ? "Ocultar" : "Mostrar"}
          </button>
        )}
      </div>

      {showHistory && (
        <div className="p-6">
          {loading && (
            <div className="flex items-center justify-center py-12">
              <IconLoader2 size={32} className="text-red-600 animate-spin mr-3" />
              <p className="text-gray-600 font-semibold">Cargando historial...</p>
            </div>
          )}

          {error && (
            <div className="flex items-center gap-3 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200">
              <IconAlertCircle size={20} />
              <span>{error}</span>
            </div>
          )}

          {!loading && !error && (
            <div className="space-y-4">
              {orders.length === 0 ? (
                <div className="text-center py-12">
                  <IconBox size={48} className="mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500 font-semibold">No hay compras registradas</p>
                  <p className="text-sm text-gray-400">Tus pedidos aparecerán aquí</p>
                </div>
              ) : (
                orders.map((order, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-lg hover:shadow-md transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">
                          {order.details || order.product_name || "Producto"}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          {order.date || order.created_at || "Fecha no disponible"}
                        </p>
                      </div>
                      <div className="text-right ml-4">
                        <p className="text-lg font-black text-red-600">
                          {formatCOP(order.total || order.price || 0)}
                        </p>
                        <div className="flex items-center gap-2 mt-2 justify-end">
                          {order.status === "Completado" || order.status === "completed" ? (
                            <>
                              <IconCheck size={16} className="text-green-600" />
                              <span className="text-sm font-semibold text-green-600">Completado</span>
                            </>
                          ) : (
                            <>
                              <IconClock size={16} className="text-yellow-600" />
                              <span className="text-sm font-semibold text-yellow-600">Pendiente</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}