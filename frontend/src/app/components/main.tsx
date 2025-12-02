"use client";

import React, { useEffect, useState } from "react";
import { IconShoppingCart } from "@tabler/icons-react";
import { ProductDetailModal } from "../products/ProductDetailModal";
import {
  TbDeviceImac, TbShirt, TbHome, TbSoccerField, TbHeart,
  TbDeviceGamepad2, TbBrandHipchat, TbDog, TbShoppingCartDiscount,
  TbTruckDelivery, TbShieldCheck, TbHeadset
} from "react-icons/tb";
import Swal from "sweetalert2";
import { useProducts } from '@/app/hooks/useProducts';

// Tipos
interface Feature {
  title: string;
  description: string;
}

interface FeatureSectionProps {
  features?: Feature[];
}

interface ProductCategory {
  id_product_category: number;
  element: string;
  type: string;
  clasification: string;
}

// Remove local Product interface and import the shared Product type
import type { Product } from '@/app/types/product';

// Mock de categorías (solo para mostrar los íconos)
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

// Features por defecto
const featuresDefault: Feature[] = [
  { title: "Tecnología avanzada", description: "Usamos IA y big data para recomendarte los mejores productos." },
  { title: "Soporte 24/7", description: "Nuestro equipo está disponible para ayudarte en cualquier momento." },
  { title: "Pagos seguros", description: "Tus compras están protegidas con los mejores estándares de seguridad." },
];

// Hook para producto más vendido aleatorio cada 30 segundos y con transición suave
function useRandomBestSeller(products: Product[]) {
  const [randomProduct, setRandomProduct] = useState<Product | null>(null);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    if (products.length > 0) {
      setRandomProduct(products[Math.floor(Math.random() * products.length)]);
      const interval = setInterval(() => {
        setFade(false);
        setTimeout(() => {
          setRandomProduct(products[Math.floor(Math.random() * products.length)]);
          setFade(true);
        }, 600);
      }, 30000);
      return () => clearInterval(interval);
    }
  }, [products]);

  return { randomProduct, fade };
}

const beneficios = [
  { text: "Envíos rápidos", icon: <TbTruckDelivery size={40} className="mx-auto text-fuchsia-600" /> },
  { text: "Pagos seguros", icon: <TbShieldCheck size={40} className="mx-auto text-fuchsia-600" /> },
  { text: "Atención 24/7", icon: <TbHeadset size={40} className="mx-auto text-fuchsia-600" /> },
];

const FeatureSection: React.FC<FeatureSectionProps> = ({ features }) => {
  const { products, isLoading } = useProducts();
  const { randomProduct: randomBestSeller, fade } = useRandomBestSeller(products);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  return (
    <section className="flex flex-col gap-0">

      {/* Banner principal */}
      <div className="w-full bg-gradient-to-b from-black via-fuchsia-500 to-fuchsia-300 pb-25 px-4 sm:px-20">
        <div className="relative rounded-xl bg-gradient-to-r from-fuchsia-700 via-fuchsia-400 to-fuchsia-700 text-white text-center py-20 shadow-lg mt-30 overflow-hidden">
          <TbShoppingCartDiscount
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white pointer-events-none z-0 opacity-40"
            size={180}
          />
          <h2 className="relative text-4xl md:text-5xl font-bold mb-2 z-10 drop-shadow-lg">
            ¡Bienvenidos a DYSAI E-commerce!
          </h2>
          <p className="relative text-xl font-light z-10 mb-6 drop-shadow">
            Explora el futuro del comercio electrónico
          </p>
          <a
            href="/products"
            className="relative inline-block z-10 mt-2 px-8 py-3 bg-white text-fuchsia-700 font-bold rounded-full shadow-lg hover:bg-fuchsia-100 transition"
          >
            Ver productos
          </a>
        </div>

        {/* Categorías */}
        <div className="mt-40">
          <h3 className="inline-block text-2xl font-bold mb-6 text-white border-l-4 border-orange-400 pl-3">
            Categorías
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((cat, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl p-6 shadow-lg border border-fuchsia-100 hover:scale-105 hover:shadow-2xl hover:border-fuchsia-400 transition-all duration-300 text-center"
              >
                {cat.icon}
                <span className="font-semibold bg-gray-50 text-black">{cat.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Transición visual */}
      <div className="h-24 bg-gradient-to-b from-fuchsia-300 to-white w-full" />

      {/* Sección principal en fondo blanco */}
      <div className="max-w-7xl mx-auto bg-white px-4 sm:px-10 py-16 flex flex-col gap-20">

        {/* Productos destacados */}
        <section>
          <h3 className="inline-block text-2xl font-bold mb-6 text-fuchsia-600 border-l-4 border-orange-400 pl-3 bg-gradient-to-r from-fuchsia-100 to-white rounded px-4 py-1">
            Productos destacados
          </h3>
          {isLoading ? (
            <div className="text-center text-fuchsia-500 py-10">Cargando productos...</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {products.slice(0, 6).map((prod) => (
                <div
                  key={prod.id}
                  className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center text-center 
                            transition-all duration-300 ease-in-out
                            hover:scale-105 hover:shadow-2xl hover:ring-2 hover:ring-fuchsia-500"
                >
                  {/* Imagen */}
                  {prod.image_url && (
                    <img
                      src={prod.image_url}
                      alt={prod.product_name}
                      className="h-32 w-full object-contain mb-4 rounded"
                    />
                  )}
                  {/* Título de producto */}
                  <h4 className="text-lg font-bold text-fuchsia-700 mb-1">{prod.product_name}</h4>
                  <p className="text-sm text-gray-700">{prod.description}</p>
                  <span className="text-green-600 font-bold text-xl block mb-2 transition-all duration-700">
                    {typeof prod.price === "number" ? `$${prod.price.toLocaleString()}` : ""}
                  </span>
                  {/* Rating con estrellas */}
                  {typeof prod.rating === "number" && (
                    <div className="flex items-center mt-2">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span key={i} className={i < Math.round(prod.rating as number) ? "text-orange-400" : "text-gray-300"}>
                          ★
                        </span>
                      ))}
                      <span className="ml-2 text-sm text-gray-600">{prod.rating.toFixed(1)}</span>
                    </div>
                  )}
                  {/* Chips de categorías */}
                  <div className="flex flex-wrap gap-2 mt-2">
                    {prod.categories?.flatMap((cat, cidx) =>
                      [cat.element, cat.type, cat.clasification]
                        .filter((tech): tech is string => Boolean(tech))
                        .map((tech, techIdx) => (
                          <span
                            key={`prod-${prod.id}-cat-${cidx}-tech-${techIdx}-${tech}`}
                            className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-semibold transition-colors duration-200 cursor-pointer hover:bg-orange-500 hover:text-white"
                          >
                            {tech}
                          </span>
                        ))
                    )}
                  </div>
                  {/* Botones */}
                  <div className="flex gap-2 mt-4">
                    <button
                      className="text-fuchsia-500 hover:text-fuchsia-500 transition-colors duration-200 flex items-center justify-center"
                      title="Agregar al carrito"
                      onClick={() => Swal.fire({
                        icon: "success",
                        title: "¡Producto agregado al carrito!",
                        html: `<b>${prod.product_name}</b> se ha añadido a tu carrito.`,
                        showConfirmButton: false,
                        timer: 1800,
                        timerProgressBar: true,
                        background: "#fff0fa",
                        color: "#a21caf",
                        iconColor: "#a21caf",
                        customClass: {
                          popup: "swal2-border-radius"
                        },
                        didOpen: () => {
                          const popup = document.querySelector('.swal2-popup');
                          if (popup) popup.classList.add('animate__animated', 'animate__bounceIn');
                        }
                      })}
                    >
                      <IconShoppingCart size={24} stroke={2} />
                    </button>
                    <button
                      className="bg-fuchsia-500 hover:bg-fuchsia-600 text-white px-4 py-2 rounded transition-colors duration-200 font-semibold"
                      onClick={() => setSelectedProduct(prod)}
                    >
                      Ver más
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Modal de detalle de producto */}
        {selectedProduct && (
          <ProductDetailModal
            product={{
              ...selectedProduct,
              id: String(selectedProduct.id)
            }}
            onClose={() => setSelectedProduct(null)}
          />
        )}

        {/* Lo más vendido */}
        <section>
          <h3 className="inline-block text-2xl font-bold mb-6 text-fuchsia-600 border-l-4 border-orange-400 pl-3 bg-gradient-to-r from-fuchsia-100 to-white rounded px-4 py-1">
            Lo más vendido
          </h3>
          <div className="flex justify-center">
            {randomBestSeller && (
              <div
                className={`
                  bg-white
                  rounded-xl p-8 text-center
                  shadow-lg shadow-[0_8px_48px_rgba(200,31,255,0.15)]
                  max-w-xs w-full
                  transition-all duration-700 ease-in-out
                  hover:scale-105 hover:shadow-2xl hover:ring-2 hover:ring-fuchsia-400
                  ${fade ? "opacity-100 scale-100 blur-0" : "opacity-0 scale-95 blur-sm"}
                `}
              >
                {/* Imagen del producto */}
                {randomBestSeller.image_url && (
                  <img
                    src={randomBestSeller.image_url}
                    alt={randomBestSeller.product_name}
                    className="mx-auto mb-4 h-32 object-contain rounded transition-all duration-700 ease-in-out"
                  />
                )}
                {/* Nombre */}
                <h4 className="font-semibold text-fuchsia-700 text-lg mb-2 transition-all duration-700">
                  {randomBestSeller.product_name}
                </h4>
                {/* Precio */}
                <span className="text-green-600 font-bold text-xl block mb-2 transition-all duration-700">
                  {typeof randomBestSeller.price === "number" ? `$${randomBestSeller.price.toLocaleString()}` : ""}
                </span>
                {/* Categorías */}
                <div className="flex flex-wrap gap-2 mt-2 justify-center mb-2">
                  {randomBestSeller.categories?.flatMap((cat, cidx) =>
                    [cat.element, cat.type, cat.clasification]
                      .filter((tech): tech is string => Boolean(tech))
                      .map((tech, techIdx) => (
                        <span
                          key={`best-${randomBestSeller.id}-cat-${cidx}-tech-${techIdx}-${tech}`}
                          className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-semibold transition-colors duration-200 cursor-pointer hover:bg-orange-500 hover:text-white"
                        >
                          {tech}
                        </span>
                      ))
                  )}
                </div>
                {/* Rating */}
                {typeof randomBestSeller.rating === "number" && (
                  <div className="flex items-center justify-center mt-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                                          <span
                                            key={i}
                                            className={
                                              typeof randomBestSeller.rating === "number" && i < Math.round(randomBestSeller.rating)
                                                ? "text-yellow-400"
                                                : "text-gray-300"
                                            }
                                          >
                                            ★
                                          </span>
                                        ))}
                    <span className="ml-2 text-sm text-gray-600">
                      {randomBestSeller.rating.toFixed(1)}
                    </span>
                  </div>
                )}
                {/* Botón agregar al carrito */}
                <div className="flex justify-center mt-4">
                  <button
                    className="text-fuchsia-500 hover:text-fuchsia-500 transition-colors duration-200 flex items-center justify-center"
                    title="Agregar al carrito"
                    onClick={() => Swal.fire({
                      icon: "success",
                      title: "¡Producto agregado al carrito!",
                      text: `Has agregado: ${randomBestSeller.product_name}`,
                      showConfirmButton: false,
                      timer: 1800,
                      timerProgressBar: true,
                      background: "#fff0fa",
                      color: "#a21caf",
                      iconColor: "#a21caf",
                      position: "top-end",
                      toast: true,
                    })}
                  >
                    <IconShoppingCart size={24} stroke={2} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Beneficios */}
        <section className="flex flex-col gap-16">
          <div>
            <h3 className="inline-block text-2xl font-bold mb-6 text-fuchsia-600 border-l-4 border-orange-400 pl-3 bg-gradient-to-r from-fuchsia-100 to-white rounded px-4 py-1">
              Beneficios de comprar aquí
            </h3>
            <div className="grid md:grid-cols-3 gap-6 text-center">
              {beneficios.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-xl p-6 shadow-lg transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-2xl hover:ring-2 hover:ring-fuchsia-400"
                >
                  {item.icon}
                  <p className="font-medium mt-2 text-fuchsia-700">{item.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Nuestra tecnología */}
          <div>
            <h3 className="inline-block text-2xl font-bold mb-6 text-fuchsia-600 border-l-4 border-orange-400 pl-3 bg-gradient-to-r from-fuchsia-100 to-white rounded px-4 py-1">
              Nuestra tecnología
            </h3>
            <div className="grid md:grid-cols-3 gap-6 text-center">
              {(features ?? featuresDefault).map((f, i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl p-6 shadow-lg transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-2xl hover:ring-2 hover:ring-fuchsia-400"
                >
                  <h4 className="font-semibold text-xl mb-2 text-fuchsia-700">{f.title}</h4>
                  <p className="text-sm text-gray-700">{f.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </section>
  );
};

export default FeatureSection;