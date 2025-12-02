'use client';
import { useProducto } from './context';
import { useState } from 'react';

export default function Paso4Imagen({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  const { producto, setProducto } = useProducto();
  const [preview, setPreview] = useState(producto.imagenUrl);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setProducto({ imagenUrl: url });
    setPreview(url);
  };

  const validarYContinuar = () => {
    if (!producto.imagenUrl || !producto.imagenUrl.startsWith('http')) {
      setError('Ingresa una URL válida.');
      return;
    }

    setError('');
    onNext();
  };

  return (
    <div className="bg-white p-8 rounded-3xl shadow-2xl space-y-8 text-[#18122B] relative overflow-hidden font-['Poppins',_ui-sans-serif]">
      {/* Glow border effect eliminado */}

      <h2 className="text-3xl font-extrabold text-center mb-2 bg-gradient-to-r from-fuchsia-400 via-purple-400 to-purple-700 bg-clip-text text-transparent drop-shadow-lg tracking-wide animate-title-gradient font-['Poppins',_ui-sans-serif]">
        Paso 4: Imagen del producto
      </h2>

      <div className="space-y-5 z-10 relative">
        <div>
          <input
            type="url"
            placeholder="URL de la imagen"
            value={producto.imagenUrl}
            onChange={handleChange}
            className="w-full p-4 rounded-xl bg-[#f8f5fc] text-[#18122B] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 border border-fuchsia-200 focus:border-fuchsia-400 transition shadow-md font-['Poppins',_ui-sans-serif]"
          />
        </div>
        {preview && (
          <div className="flex justify-center">
            <img
              src={preview}
              alt="Vista previa"
              className="w-40 h-40 object-cover border-2 border-fuchsia-500 shadow-lg rounded-2xl bg-[#f8f5fc]"
            />
          </div>
        )}
      </div>

      {error && <p className="text-fuchsia-500 text-sm text-center font-medium mt-2 animate-pulse font-['Poppins',_ui-sans-serif]">{error}</p>}

      <div className="flex gap-2 mt-2">
        <button onClick={onBack} className="w-full py-3 rounded-xl bg-[#f8f5fc] text-[#18122B] font-semibold shadow transition hover:bg-fuchsia-100 font-['Poppins',_ui-sans-serif]">Atrás</button>
        <button onClick={validarYContinuar} className="w-full bg-gradient-to-r from-fuchsia-500 to-purple-600 hover:from-purple-600 hover:to-fuchsia-500 py-3 rounded-xl transition-transform hover:scale-105 font-bold shadow-lg text-white text-lg tracking-wide flex items-center justify-center gap-2 font-['Poppins',_ui-sans-serif]">
          Siguiente
          <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
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



