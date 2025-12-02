'use client';
import { useProducto } from './context';
import { useState } from 'react';

export default function Paso1Categoria({ onNext }: { onNext: () => void }) {
  const { producto, setProducto } = useProducto();
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProducto({
      categoria: { ...producto.categoria, [e.target.name]: e.target.value },
    });
  };

  const validarYContinuar = () => {
    const { element, type, clasification } = producto.categoria;
    if (!element || !type || !clasification) {
      setError('Completa todos los campos de la categoría.');
      return;
    }
    setError('');
    onNext();
  };

  return (
    <div className="bg-white p-8 rounded-3xl shadow-2xl border border-fuchsia-600/30 space-y-8 text-[#18122B] relative overflow-hidden font-['Poppins',_ui-sans-serif]">
      {/* Solo el glow superior, sin caja doble ni borde inferior extra */}
      {/* Si tienes un div con absolute que genera el borde inferior, elimínalo */}
      {/* Si el efecto sigue, revisa el componente padre o layout por si hay un div extra */}

      <h2 className="text-3xl font-extrabold text-center mb-2 bg-gradient-to-r from-fuchsia-400 via-purple-400 to-purple-700 bg-clip-text text-transparent drop-shadow-lg tracking-wide animate-title-gradient font-['Poppins',_ui-sans-serif]">
        Paso 1: Categoría del producto
      </h2>

      <div className="space-y-5 z-10 relative">
        <div>
          <input
            name="element"
            placeholder="Categoría"
            onChange={handleChange}
            className="w-full p-4 rounded-xl bg-[#f8f5fc] text-[#18122B] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 border border-fuchsia-200 focus:border-fuchsia-400 transition shadow-md font-['Poppins',_ui-sans-serif]"
          />
        </div>
        <div>
          <input
            name="type"
            placeholder="Subcategoría"
            onChange={handleChange}
            className="w-full p-4 rounded-xl bg-[#f8f5fc] text-[#18122B] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 border border-fuchsia-200 focus:border-fuchsia-400 transition shadow-md font-['Poppins',_ui-sans-serif]"
          />
        </div>
        <div>
          <input
            name="clasification"
            placeholder="Clasificación"
            onChange={handleChange}
            className="w-full p-4 rounded-xl bg-[#f8f5fc] text-[#18122B] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 border border-fuchsia-200 focus:border-fuchsia-400 transition shadow-md font-['Poppins',_ui-sans-serif]"
          />
        </div>
      </div>

      {error && <p className="text-fuchsia-500 text-sm text-center font-medium mt-2 animate-pulse font-['Poppins',_ui-sans-serif]">{error}</p>}

      <button
        onClick={validarYContinuar}
        className="w-full py-3 mt-2 bg-gradient-to-r from-fuchsia-500 to-purple-600 hover:from-purple-600 hover:to-fuchsia-500 text-white font-bold rounded-xl shadow-lg transition-transform hover:scale-105 focus:ring-2 focus:ring-fuchsia-400 focus:outline-none text-lg tracking-wide font-['Poppins',_ui-sans-serif]"
      >
        <span className="inline-flex items-center gap-2">
          Siguiente
          <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
        </span>
      </button>
    </div>
  );
}



