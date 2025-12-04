"use client";

import {
  TbDeviceImac, TbShirt, TbHome, TbSoccerField, TbHeart,
  TbDeviceGamepad2, TbBrandHipchat, TbDog
} from "react-icons/tb";

const categories = [
  { name: "Tecnología", icon: <TbDeviceImac size={32} className="mx-auto mb-2 text-purple-700" /> },
  { name: "Moda", icon: <TbShirt size={32} className="mx-auto mb-2 text-pink-500" /> },
  { name: "Hogar", icon: <TbHome size={32} className="mx-auto mb-2 text-yellow-600" /> },
  { name: "Deportes", icon: <TbSoccerField size={32} className="mx-auto mb-2 text-green-600" /> },
  { name: "Salud", icon: <TbHeart size={32} className="mx-auto mb-2 text-red-500" /> },
  { name: "Videojuegos", icon: <TbDeviceGamepad2 size={32} className="mx-auto mb-2 text-blue-600" /> },
  { name: "Belleza", icon: <TbBrandHipchat size={32} className="mx-auto mb-2 text-fuchsia-500" /> },
  { name: "Mascotas", icon: <TbDog size={32} className="mx-auto mb-2 text-orange-500" /> },
];

const CategoriesGrid = () => {
  return (
    <div className="mt-5 px-4 sm:px-20">
      <h3 className="inline-block text-2xl font-bold mb-6 text-[#C73838] border-l-4 border-[#e8710fff] pl-3 bg-gradient-to-r from-red-100 to-white rounded px-4 py-1">
        Categorías
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {categories.map((cat, idx) => (
          <div
            key={idx}
            className="bg-white rounded-xl p-6 shadow-lg border border-red-100 hover:scale-105 hover:shadow-2xl hover:border-[#E36A6A] transition-all duration-300 text-center"
          >
            {cat.icon}
            <span className="font-semibold bg-gray-50 text-black">{cat.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoriesGrid;
