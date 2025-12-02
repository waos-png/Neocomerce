"use client";
import React, { useState, ReactNode } from "react";




/**
 * Formatea un número como moneda en pesos colombianos (COP).
 * @param value Valor numérico a formatear
 * @returns Cadena con formato de moneda COP
 */
function formatCOP(value: number) {
  return value.toLocaleString("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  });
}

/**
 * Componente de historial de compras del usuario.
 * Permite mostrar/ocultar el historial, consulta la API real y muestra los pedidos.
 * Incluye manejo de errores y estado de carga.
 * @param extraButton Botón adicional opcional
 * @param showToggleButton Muestra el botón para alternar visibilidad
 * @param showHistoryProp Estado inicial de visibilidad del historial
 */
export default function OrderHistory({ extraButton, showToggleButton = true, showHistoryProp }: { extraButton?: ReactNode, showToggleButton?: boolean, showHistoryProp?: boolean }) {
  // Estado para mostrar/ocultar historial
  const [showHistory, setShowHistory] = useState(showHistoryProp ?? false);
  // Estado para almacenar los pedidos
  const [orders, setOrders] = useState<any[]>([]);
  // Estado de carga
  const [loading, setLoading] = useState(false);
  // Estado de error
  const [error, setError] = useState<string | null>(null);

  // Efecto para obtener el historial de compras cuando se muestra
  React.useEffect(() => {
    if (showHistory) {
      const fetchOrders = async () => {
        setLoading(true);
        setError(null);
        try {
          const token = localStorage.getItem('token') || localStorage.getItem('sellerToken');
          if (!token) {
            setError('No autenticado. Inicia sesión para ver tu historial.');
            setOrders([]);
            setLoading(false);
            return;
          }
          // Llamada a la API real de historial de compras
          const response = await fetch('https://willowy-shea-juansemeh-8bfd93dc.koyeb.app/orders/history/', {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });
          if (!response.ok) {
            throw new Error('No se pudo obtener el historial.');
          }
          const data = await response.json();
          // Ajusta esto según la estructura real de la respuesta
          setOrders(Array.isArray(data) ? data : (data.orders || []));
        } catch (err: any) {
          setError(err.message || 'Error desconocido');
        } finally {
          setLoading(false);
        }
      };
      fetchOrders();
    }
  }, [showHistory]);

  // Alterna la visibilidad del historial
  const toggleHistory = () => {
    setShowHistory(!showHistory);
  };

  // Render principal del historial de compras
  return (
    <div className="max-w-4xl w-full bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-xl font-semibold text-purple-700">Historial de Compras</h2>
          <p className="text-sm text-gray-600 mt-1">Aquí puedes ver el resumen de tus compras recientes.</p>
        </div>
        {showToggleButton && (
          <button
            onClick={toggleHistory}
            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-purple-500 transform hover:scale-105 transition-transform duration-300 ease-in-out w-24 px-0"
          >
            {showHistory ? "Ocultar" : "Mostrar"}
          </button>
        )}
      </div>
      {showHistory && (
        <>
          {loading && <p className="text-gray-500">Cargando historial...</p>}
          {error && <p className="text-red-500">{error}</p>}
          {!loading && !error && (
            <ul className="divide-y divide-gray-200">
              {orders.length === 0 && <li className="py-4 text-gray-500">No hay compras registradas.</li>}
              {orders.map((order, index) => (
                <li
                  key={index}
                  className="py-4 flex justify-between items-center hover:bg-purple-50 rounded-md transition-colors duration-200 cursor-default"
                >
                  <div>
                    <p className="font-semibold text-gray-900">{order.details || order.product_name || 'Producto'}</p>
                    <p className="text-sm text-gray-500">{order.date || order.created_at || ''}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">{formatCOP(order.total || order.price || 0)}</p>
                    <p className="text-sm text-green-600">{order.status || 'Completado'}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
      {extraButton && <div className="mt-4">{extraButton}</div>}
    </div>
  );
}