'use client';
import { useProducto } from './context';
import { useState } from 'react';

export default function Paso5Revision({ onBack }: { onBack: () => void }) {
  const { producto } = useProducto();
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState('');

  const publicarProducto = async () => {
    setLoading(true);
    setMensaje('');

    const token = localStorage.getItem('token');
    const res = await fetch('https://willowy-shea-juansemeh-8bfd93dc.koyeb.app/products/create/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        id_provider: 1,
        product_name: producto.nombre,
        price: producto.precio,
        stock: producto.stock,
        description: producto.descripcion,
        image_url: producto.imagenUrl,
        categories_input: [producto.categoria],
      }),
    });

    const data = await res.json();
    setMensaje(res.ok ? '✅ Producto publicado exitosamente' : `❌ Error: ${data?.error || 'Error al publicar'}`);
    setLoading(false);
  };

  return (
    <div className="bg-white p-8 rounded-3xl shadow-2xl space-y-8 text-[#18122B] relative overflow-hidden font-['Poppins',_ui-sans-serif]">
      {/* Glow border effect eliminado */}

      <h2 className="text-3xl font-extrabold text-center mb-2 bg-gradient-to-r from-fuchsia-400 via-purple-400 to-purple-700 bg-clip-text text-transparent drop-shadow-lg tracking-wide animate-title-gradient font-['Poppins',_ui-sans-serif]">
        Paso 5: Revisión y publicación
      </h2>

      <div className="bg-[#f8f5fc] p-6 rounded-2xl space-y-3 shadow-md z-10 relative">
        <p><span className="font-semibold text-fuchsia-400">Nombre:</span> {producto.nombre}</p>
        <p><span className="font-semibold text-fuchsia-400">Descripción:</span> {producto.descripcion}</p>
        <p><span className="font-semibold text-fuchsia-400">Estado:</span> {producto.estado}</p>
        <p><span className="font-semibold text-fuchsia-400">Precio:</span> <span className="font-mono">${producto.precio}</span></p>
        <p><span className="font-semibold text-fuchsia-400">Stock:</span> <span className="font-mono">{producto.stock}</span></p>
        <p><span className="font-semibold text-fuchsia-400">Garantía:</span> {producto.garantia || 'No aplica'}</p>
        <p><span className="font-semibold text-fuchsia-400">Categoría:</span> {producto.categoria.element}, {producto.categoria.type}, {producto.categoria.clasification}</p>
        <div className="flex justify-center">
          <img src={producto.imagenUrl} alt="Imagen del producto" className="w-40 h-40 object-cover border-2 border-fuchsia-500 shadow-lg rounded-2xl bg-[#f8f5fc]" />
        </div>
      </div>

      {mensaje && (
        <p className={`text-sm text-center font-medium mt-2 animate-pulse ${mensaje.startsWith('✅') ? 'text-green-500' : 'text-red-500'} font-['Poppins',_ui-sans-serif]`}>
          {mensaje}
        </p>
      )}

      <div className="flex gap-2 mt-2">
        <button
          onClick={onBack}
          className="w-full py-3 rounded-xl bg-[#f8f5fc] text-[#18122B] font-semibold shadow transition hover:bg-fuchsia-100 font-['Poppins',_ui-sans-serif]"
        >
          Atrás
        </button>
        <button
          onClick={publicarProducto}
          disabled={loading}
          className={`w-full bg-gradient-to-r from-fuchsia-500 to-purple-600 hover:from-purple-600 hover:to-fuchsia-500 py-3 rounded-xl transition-transform hover:scale-105 font-bold shadow-lg text-white text-lg tracking-wide flex items-center justify-center gap-2 font-['Poppins',_ui-sans-serif] ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}
        >
          {loading ? 'Publicando...' : (
            <>
              <span>Publicar producto</span>
              <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </>
          )}
        </button>
      </div>

      <style jsx>{`
        .animate-title-gradient {
          animation: titleFadeIn 0.7s cubic-bezier(0.4,0,0.2,1);
        }
        @keyframes titleFadeIn {
          from { opacity: 0; transform: translateY(-16px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}



