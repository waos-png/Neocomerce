"use client";

import { FiTarget } from "react-icons/fi";

const HeroBanner = () => {
  return (
    <>
      {/* Banner principal */}
      <div className="w-full bg-gradient-to-b from-black via-[#810606] to-[#a81515] pb-40 px-4 sm:px-20">
        <div className="relative rounded-xl bg-gradient-to-r from-[#3b0202] via-[#B11212] to-[#3b0202] text-white text-center py-20 shadow-lg mt-30 overflow-hidden">
          
          <FiTarget
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white pointer-events-none z-0 opacity-40"
            size={180}
          />

          <h2 className="relative text-4xl md:text-5xl font-bold mb-2 z-10 drop-shadow-lg">
            ¡Bienvenidos a NeoCommerce!
          </h2>

          <p className="relative text-xl font-light z-10 mb-6 drop-shadow">
            Explora el futuro del comercio electrónico
          </p>

          <a
            href="/products"
            className="relative inline-block z-10 mt-2 px-8 py-3 bg-white text-[#810606] font-bold rounded-full shadow-lg hover:bg-[#f5eaea] transition"
          >
            Ver productos
          </a>

        </div>

        {/* Categorías van en su propio componente */}
      </div>

      {/* Transición visual */}
      <div className="-mt-20 h-30 bg-gradient-to-b from-[#a81515] to-white w-full" />
    </>
  );
};

export default HeroBanner;
