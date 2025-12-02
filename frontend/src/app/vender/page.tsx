'use client';

import { useState } from 'react';
import { ProductoProvider } from '../vender/context';
import Paso1Categoria from '../vender/Paso1Categoria';
import Paso2Detalles from '../vender/Paso2Detalles';
import Paso3Precio from '../vender/Paso3Precio';
import Paso4Imagen from '../vender/Paso4Imagen';
import Paso5Revision from '../vender/Paso5Revision';

export default function Page() {
  const [paso, setPaso] = useState(1);

  const next = () => setPaso((p) => Math.min(p + 1, 5));
  const back = () => setPaso((p) => Math.max(p - 1, 1));

  const pasos = ['Categoría', 'Detalles', 'Precio', 'Imagen', 'Revisión'];

  return (
    <ProductoProvider>
      <div className="max-w-4xl mx-auto p-6 mt-10 font-sans">
        {/* TÍTULO CON DEGRADADO Y ANIMACIÓN */}
        <div className="flex justify-center w-full">
          <h1
            className="text-4xl sm:text-5xl font-extrabold mb-8 text-center tracking-wider drop-shadow-lg animate-title-gradient bg-gradient-to-r from-fuchsia-500 via-purple-500 to-purple-800 bg-clip-text text-transparent w-full px-2"
            style={{ letterSpacing: '0.04em', wordBreak: 'break-word', lineHeight: 1.1, overflowWrap: 'break-word', whiteSpace: 'normal', maxWidth: '100%' }}
          >
            Agregar producto
          </h1>
        </div>
        <style jsx>{`
          .animate-title-gradient {
            animation: titleFadeIn 0.8s cubic-bezier(0.4,0,0.2,1);
          }
          @keyframes titleFadeIn {
            from { opacity: 0; transform: translateY(-20px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>

        {/* BARRA DE PASOS CON LÍNEA ATRAVESANDO LOS CÍRCULOS */}
        <div className="relative flex items-center justify-center mb-10 px-2 select-none" style={{ height: '64px' }}>
          {/* Línea base más delgada y aún más arriba */}
          <div className="absolute w-[80%] left-[10%]" style={{ top: '28%', height: '4px', background: '#e5e7eb', borderRadius: '9999px', zIndex: 0 }} />
          {/* Línea de progreso más delgada, más arriba y de fucsia a morado */}
          <div
            className="absolute left-[10%] bg-gradient-to-r from-fuchsia-500 to-purple-600 z-10 rounded-full transition-all duration-500"
            style={{ top: '28%', height: '4px', width: `${((paso - 1) / (pasos.length - 1)) * 100}%`, maxWidth: '80%' }}
          />
          <div className="flex justify-between items-center w-[80%] mx-auto z-20">
            {pasos.map((label, index) => {
              const stepNum = index + 1;
              const isActive = paso === stepNum;
              const isCompleted = paso > stepNum;
              return (
                <div key={label} className="flex flex-col items-center text-center" style={{ zIndex: 30 }}>
                  <div
                    className={`relative w-10 h-10 flex items-center justify-center rounded-full text-base font-extrabold transition-all duration-300
                      ${isCompleted ? 'bg-gradient-to-br from-fuchsia-500 to-purple-600 text-white scale-110 shadow-xl' :
                        isActive ? 'bg-white text-fuchsia-700 scale-110 shadow-lg ring-2 ring-fuchsia-200' :
                        'bg-gray-100 text-gray-400 shadow'}
                    `}
                    style={{ zIndex: 30 }}
                  >
                    {isCompleted ? (
                      <span className="flex items-center justify-center w-full h-full">
                        <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                    ) : (
                      <span className="drop-shadow-lg">{stepNum}</span>
                    )}
                  </div>
                  <span className={`text-sm mt-2 font-medium transition-colors duration-300 ${isActive ? 'text-purple-700' : isCompleted ? 'text-purple-500' : 'text-gray-400'}`}>
                    {label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* CONTENIDO DE PASO CON ANIMACIÓN */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 transition-all duration-500 min-h-[340px] flex flex-col justify-between border border-purple-100">
          <div className="animate-fade-in">
            {paso === 1 && <Paso1Categoria onNext={next} />}
            {paso === 2 && <Paso2Detalles onNext={next} onBack={back} />}
            {paso === 3 && <Paso3Precio onNext={next} onBack={back} />}
            {paso === 4 && <Paso4Imagen onNext={next} onBack={back} />}
            {paso === 5 && <Paso5Revision onBack={back} />}
          </div>
        </div>
        {/* ESTILOS PARA ANIMACIÓN */}
        <style jsx>{`
          .animate-fade-in {
            animation: fadeIn 0.5s;
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      </div>
    </ProductoProvider>
  );
}


