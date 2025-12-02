import { useState } from "react";
import { IconShoppingCart } from "@tabler/icons-react";
import Swal from "sweetalert2";
import { useCarrito } from "../context/CartContext";

interface CategoryObj {
  element?: string;
  type?: string;
  clasification?: string;
  id_product_category?: number;
}

interface ProductOrHock {
  id: string;
  product_name?: string;
  name?: string;
  description?: string;
  price?: number | string;
  image_url?: string;
  image?: string;
  categories?: CategoryObj[];
  category?: string;
}

interface ProductDetailModalProps {
  product: ProductOrHock;
  onClose: () => void;
}

export function ProductDetailModal({ product, onClose }: ProductDetailModalProps) {
  const { agregarAlCarrito } = useCarrito();
  const displayName = product.product_name || product.name || "Sin nombre";
  const displayImage = product.image_url || product.image;
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="fixed inset-0 shadow bg-opacity-10 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-[0_8px_48px_rgba(80,0,120,0.35)] max-w-md w-full relative flex flex-col gap-4">
        {/* Botón cerrar */}
        <button
          className="absolute top-4 right-4 z-20 text-gray-500 hover:text-red-500 text-2xl"
          onClick={onClose}
          aria-label="Cerrar"
        >
          ✕
        </button>

        {/* Imagen */}
        <div className="w-full flex items-center justify-center mt-2 mb-2">
          <div className="relative w-60 h-48 flex items-center justify-center">
            {displayImage && (
              <img
                src={displayImage}
                alt={displayName}
                className="w-full h-full object-cover rounded"
                style={{ objectPosition: "center" }}
              />
            )}
          </div>
        </div>

        {/* Nombre */}
        <h2 className="text-2xl font-bold text-fuchsia-700 text-center">{displayName}</h2>

        {/* Descripción */}
        {product.description && (
          <p className="text-gray-600 text-center">{product.description}</p>
        )}

        {/* Precio */}
        <div>
          <span className="font-semibold text-fuchsia-700">Precio: </span>
          <span className="text-green-600 font-bold text-xl block mb-2 transition-all duration-700">
            ${product.price}
          </span>
        </div>

        {/* Categorías */}
        <div>
          <span className="font-semibold text-fuchsia-700">Categorías: </span>
          <span className="flex flex-wrap gap-2 mt-1">
            {product.categories?.flatMap((cat, idx) =>
              [cat.element, cat.type, cat.clasification]
                .filter(Boolean)
                .map((tech, techIdx) =>
                  tech ? (
                    <span
                      key={`cat-${cat.id_product_category ?? idx}-${techIdx}-${tech}`}
                      className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-semibold transition-colors duration-200 cursor-pointer hover:bg-orange-500 hover:text-white"
                    >
                      {tech}
                    </span>
                  ) : null
                )
            )}
          </span>
        </div>

        {/* Selección de cantidad */}
        <div className="flex items-center gap-2 mt-2">
          <label htmlFor="quantity" className="font-semibold text-fuchsia-700">Cantidad:</label>
          <input
            id="quantity"
            type="number"
            min={1}
            value={quantity}
            onChange={e => setQuantity(Number(e.target.value))}
            className="w-16 border rounded px-2 py-1 text-center"
          />
        </div>

        {/* Agregar al carrito */}
        <div className="flex justify-end mt-2">
          <button
            className="text-fuchsia-500 hover:text-fuchsia-700 transition-colors duration-200 flex items-center justify-center"
            title="Agregar al carrito"
            onClick={async () => {
              if (!product.id) {
                Swal.fire({
                  icon: "error",
                  title: "Error",
                  text: "El producto no tiene ID válido",
                  background: "#fff0fa",
                  color: "#a21caf",
                  iconColor: "#a21caf",
                });
                return;
              }
              try {
                await agregarAlCarrito(Number(product.id), quantity);
                Swal.fire({
                  icon: "success",
                  title: "¡Producto agregado al carrito!",
                  html: `<b>${displayName}</b> se ha añadido a tu carrito.`,
                  showConfirmButton: false,
                  timer: 1800,
                  timerProgressBar: true,
                  background: "#fff0fa",
                  color: "#a21caf",
                  iconColor: "#a21caf",
                });
              } catch (error) {
                Swal.fire({
                  icon: "error",
                  title: "Error",
                  text: error instanceof Error ? error.message : "No se pudo agregar al carrito.",
                  background: "#fff0fa",
                  color: "#a21caf",
                  iconColor: "#a21caf",
                });
              }
            }}
          >
            <IconShoppingCart size={24} stroke={2} />
          </button>
        </div>
      </div>
    </div>
  );
}
