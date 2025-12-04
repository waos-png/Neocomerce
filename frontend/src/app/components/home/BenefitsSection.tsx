"use client";

import { TbTruckDelivery, TbShieldCheck, TbHeadset } from "react-icons/tb";

const beneficios = [
  { text: "Envíos rápidos", icon: <TbTruckDelivery size={40} className="mx-auto text-[#C73838]" /> },
  { text: "Pagos seguros", icon: <TbShieldCheck size={40} className="mx-auto text-[#C73838]" /> },
  { text: "Atención 24/7", icon: <TbHeadset size={40} className="mx-auto text-[#C73838]" /> },
];

const BenefitsSection = () => {
  return (
    <section>
      <h3 className="inline-block text-2xl font-bold mb-6 text-[#C73838] border-l-4 border-[#e8710fff] pl-3 bg-gradient-to-r from-red-100 to-white rounded px-4 py-1">
        Beneficios de comprar aquí
      </h3>

      <div className="grid md:grid-cols-3 gap-6 text-center">
        {beneficios.map((item, idx) => (
          <div
            key={idx}
            className="bg-white rounded-xl p-6 shadow-lg transition-all hover:scale-105 hover:shadow-2xl hover:ring-2 hover:ring-red-500"
          >
            {item.icon}
            <p className="font-medium mt-2 text-[#C73838]">{item.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default BenefitsSection;
