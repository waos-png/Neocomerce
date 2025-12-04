import { useState, useEffect } from "react";
import { IconShoppingCart, IconX, IconMinus, IconPlus, IconCheck, IconTruck, IconShield } from "@tabler/icons-react";
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
  rating?: number;
}

interface ProductDetailModalProps {
  product: ProductOrHock;
  onClose: () => void;
}

/**
 * Componente ProductDetailModal
 * Muestra los detalles completos de un producto en un modal profesional
 * Permite agregar el producto al carrito con cantidad personalizada
 * 
 * @param product - Producto a mostrar
 * @param onClose - Callback para cerrar el modal
 */
export function ProductDetailModal({ product, onClose }: ProductDetailModalProps) {
  const { agregarAlCarrito } = useCarrito();
  const displayName = product.product_name || product.name || "Sin nombre";
  const displayImage = product.image_url || product.image;
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  const handleIncrement = () => {
    setQuantity(q => q + 1);
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(q => q - 1);
    }
  };

  /**
   * Muestra alerta de error profesional
   */
  const showErrorAlert = (title: string, message: string) => {
    Swal.fire({
      icon: "error",
      title: title,
      html: `
        <div style="text-align: center; padding: 0;">
          <p style="font-size: 0.95rem; color: #666; line-height: 1.6; margin: 0;">${message}</p>
        </div>
      `,
      background: "#fff5f5",
      color: "#1F2937",
      confirmButtonColor: "#C73838",
      confirmButtonText: "Entendido",
      customClass: {
        container: "swal-container-professional",
        popup: "swal-popup-professional",
        title: "swal-title-professional",
        htmlContainer: "swal-html-professional",
        confirmButton: "swal-confirm-button-professional",
        icon: "swal-icon-error",
      } as any,
      allowOutsideClick: false,
      didOpen: (modal: HTMLElement) => {
        const container = modal.parentElement as HTMLElement;
        if (container) {
          container.style.zIndex = "10001";
        }
        modal.style.borderRadius = "20px";
        modal.style.boxShadow = "0 25px 50px -12px rgba(0, 0, 0, 0.25)";
        
        const iconContainer = modal.querySelector(".swal2-icon") as HTMLElement;
        if (iconContainer) {
          iconContainer.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#C73838" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M12 8v4"></path>
              <path d="M12 16h.01"></path>
            </svg>
          `;
          iconContainer.style.borderColor = "#C73838";
        }
      },
    } as any);
  };

  /**
   * Muestra alerta de éxito profesional
   */
  const showSuccessAlert = (productName: string, qty: number) => {
    Swal.fire({
      icon: "success",
      title: "¡Agregado al carrito!",
      html: `
        <div style="text-align: center; padding: 0;">
          <div style="background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); padding: 20px; border-radius: 16px; margin: 16px 0;">
            <div style="margin-bottom: 16px;">
              <p style="font-size: 0.85rem; color: #6b7280; margin: 0; text-transform: uppercase; letter-spacing: 0.8px; font-weight: 600;">Producto</p>
              <p style="font-size: 1.05rem; font-weight: 700; color: #1F2937; margin: 8px 0 0 0; display: flex; align-items: center; justify-content: center; gap: 10px;">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                ${productName}
              </p>
            </div>
            <div style="height: 2px; background: rgba(22, 163, 74, 0.2); margin: 0;"></div>
            <div style="margin-top: 16px;">
              <p style="font-size: 0.85rem; color: #6b7280; margin: 0; text-transform: uppercase; letter-spacing: 0.8px; font-weight: 600;">Cantidad</p>
              <p style="font-size: 1.3rem; font-weight: 700; color: #C73838; margin: 8px 0 0 0; display: flex; align-items: center; justify-content: center; gap: 10px;">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#C73838" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="1"></circle>
                  <circle cx="12" cy="5" r="1"></circle>
                  <circle cx="12" cy="19" r="1"></circle>
                </svg>
                ${qty} ${qty > 1 ? "unidades" : "unidad"}
              </p>
            </div>
          </div>
        </div>
      `,
      background: "#f0fdf4",
      color: "#1F2937",
      confirmButtonColor: "#16a34a",
      confirmButtonText: "Continuar comprando",
      customClass: {
        container: "swal-container-professional",
        popup: "swal-popup-professional",
        title: "swal-title-professional-success",
        htmlContainer: "swal-html-professional",
        confirmButton: "swal-confirm-button-success",
        icon: "swal-icon-success",
      } as any,
      allowOutsideClick: false,
      timer: 2500,
      timerProgressBar: true,
      didOpen: (modal: HTMLElement) => {
        const container = modal.parentElement as HTMLElement;
        if (container) {
          container.style.zIndex = "10001";
        }
        modal.style.borderRadius = "20px";
        modal.style.boxShadow = "0 25px 50px -12px rgba(0, 0, 0, 0.25)";
        
        const iconContainer = modal.querySelector(".swal2-icon") as HTMLElement;
        if (iconContainer) {
          iconContainer.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M22 11.08v1.93a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          `;
          iconContainer.style.borderColor = "#16a34a";
        }
        
        const timerBar = modal.querySelector(".swal2-timer-progress-bar") as HTMLElement;
        if (timerBar) {
          timerBar.style.background = "linear-gradient(90deg, #16a34a, #22c55e)";
          timerBar.style.height = "4px";
        }
      },
    } as any);
  };

  const handleAddToCart = async () => {
    if (!product.id) {
      showErrorAlert("Error de producto", "El producto no tiene un ID válido. Por favor, intenta de nuevo.");
      return;
    }

    try {
      setIsLoading(true);
      await agregarAlCarrito(Number(product.id), quantity);
      
      showSuccessAlert(displayName, quantity);
      
      setTimeout(() => {
        onClose();
        setQuantity(1);
      }, 2500);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "No se pudo agregar el producto al carrito. Intenta de nuevo.";
      showErrorAlert("No se pudo agregar", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-md z-[999] transition-opacity duration-300"
        onClick={onClose}
        role="presentation"
      />

      {/* Modal Container */}
      <div 
        className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6"
        onClick={e => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        {/* Modal */}
        <div 
          className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[95vh] overflow-hidden border border-red-50"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 z-10 bg-white px-6 sm:px-8 py-4 flex justify-between items-center border-b border-gray-100">
            <h2 className="text-lg font-bold text-gray-900">Detalles del Producto</h2>
            <button
              className="p-2 rounded-lg text-gray-400 hover:text-[#C73838] hover:bg-red-50 transition-all duration-200"
              onClick={onClose}
              aria-label="Cerrar modal"
            >
              <IconX size={24} stroke={2} />
            </button>
          </div>

          {/* Contenido scrollable */}
          <div className="overflow-y-auto max-h-[calc(95vh-70px)]">
            <div className="p-6 sm:p-10">
              
              {/* Grid Principal */}
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 mb-10">
                
                {/* Imagen - 2 columnas */}
                <div className="lg:col-span-2">
                  <div className="relative w-full h-64 rounded-2xl bg-gradient-to-br from-red-50 via-white to-red-50 flex items-center justify-center overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                    {displayImage ? (
                      <img
                        src={displayImage}
                        alt={displayName}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                        onError={e => {
                          const target = e.currentTarget;
                          target.onerror = null;
                          target.src = "/images/image-not-found.png";
                        }}
                      />
                    ) : (
                      <div className="text-5xl opacity-20">📦</div>
                    )}
                  </div>
                  {/* Badge verificado */}
                  <div className="mt-4 text-center text-xs text-gray-500 font-medium flex items-center justify-center gap-1.5">
                    <IconCheck size={14} className="text-green-600" stroke={3} />
                    Producto verificado
                  </div>
                </div>

                {/* Contenido - 3 columnas */}
                <div className="lg:col-span-3 flex flex-col justify-between">
                  
                  {/* Sección superior - Info del producto */}
                  <div className="space-y-6">
                    
                    {/* Nombre y Rating */}
                    <div className="space-y-3">
                      <h1 className="text-3xl lg:text-4xl font-black text-gray-900 leading-tight">
                        {displayName}
                      </h1>
                      
                      {/* Rating */}
                      {typeof product.rating === "number" && (
                        <div className="flex items-center gap-2">
                          <div className="flex gap-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <span
                                key={i}
                                className={`text-lg ${
                                  i < Math.round(product.rating as number)
                                    ? "text-amber-400"
                                    : "text-gray-300"
                                }`}
                              >
                                ★
                              </span>
                            ))}
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="font-bold text-gray-900">
                              {product.rating.toFixed(1)}
                            </span>
                            <span className="text-sm text-gray-600">
                              (234 reseñas)
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Descripción */}
                    {product.description && (
                      <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                        <p className="text-gray-700 text-sm leading-relaxed">
                          {product.description}
                        </p>
                      </div>
                    )}

                    {/* Categorías */}
                    {(product.categories?.length || product.category) && (
                      <div className="space-y-2">
                        <p className="text-xs font-bold text-gray-700 uppercase tracking-wide">Categorías</p>
                        <div className="flex flex-wrap gap-2">
                          {product.categories && product.categories.length > 0
                            ? product.categories.flatMap((cat, idx) =>
                                [cat.element, cat.type, cat.clasification]
                                  .filter((val): val is string => Boolean(val))
                                  .map((tech, techIdx) => (
                                    <span
                                      key={`cat-${cat.id_product_category ?? idx}-${techIdx}-${tech}`}
                                      className="bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 hover:bg-blue-100 hover:text-blue-900 cursor-pointer"
                                    >
                                      {tech}
                                    </span>
                                  ))
                              )
                            : (
                              <span className="bg-slate-100 text-slate-700 px-3 py-1.5 rounded-full text-xs font-semibold">
                                {product.category || "Sin categoría"}
                              </span>
                            )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Sección inferior - Precio y Carrito */}
                  <div className="space-y-4 pt-6 border-t border-gray-200">
                    
                    {/* Precio */}
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-2xl border-2 border-green-200">
                      <p className="text-gray-600 text-sm font-semibold mb-2">Precio actual</p>
                      <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-black text-green-600">
                          ${typeof product.price === "string" ? product.price : (product.price || 0).toFixed(2)}
                        </span>
                        <span className="text-sm text-gray-500 line-through">
                          ${(typeof product.price === "string" ? parseFloat(product.price) : (product.price || 0)) * 1.2}
                        </span>
                      </div>
                      <p className="text-xs text-green-700 font-semibold mt-2 flex items-center gap-1">
                        <IconCheck size={12} stroke={3} />
                        Mejor precio garantizado
                      </p>
                    </div>

                    {/* Cantidad */}
                    <div className="space-y-3">
                      <label className="text-sm font-bold text-gray-900 block">
                        Selecciona la cantidad:
                      </label>
                      <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-xl border border-gray-200">
                        <button
                          onClick={handleDecrement}
                          disabled={quantity <= 1}
                          className="p-2.5 rounded-lg bg-red-100 text-[#C73838] hover:bg-[#C73838] hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
                          aria-label="Decrementar"
                        >
                          <IconMinus size={18} stroke={2.5} />
                        </button>
                        
                        <input
                          type="number"
                          min={1}
                          value={quantity}
                          onChange={e => {
                            const val = Number(e.target.value);
                            if (val > 0) setQuantity(val);
                          }}
                          className="flex-1 border-2 border-red-200 rounded-lg px-4 py-2 text-center font-bold text-[#C73838] focus:outline-none focus:border-[#C73838] transition-colors"
                        />
                        
                        <button
                          onClick={handleIncrement}
                          className="p-2.5 rounded-lg bg-red-100 text-[#C73838] hover:bg-[#C73838] hover:text-white transition-all duration-200"
                          aria-label="Incrementar"
                        >
                          <IconPlus size={18} stroke={2.5} />
                        </button>
                      </div>
                    </div>

                    {/* Botón Agregar al carrito */}
                    <button
                      onClick={handleAddToCart}
                      disabled={isLoading}
                      className="w-full bg-gradient-to-r from-[#C73838] to-[#B11212] hover:from-[#B11212] hover:to-[#8f0e0e] disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl flex items-center justify-center gap-3 transition-all duration-200 text-lg"
                    >
                      <IconShoppingCart size={24} stroke={2} />
                      <span>
                        {isLoading ? "Agregando..." : "Agregar al carrito"}
                      </span>
                    </button>

                    {/* Info de entrega */}
                    <div className="grid grid-cols-2 gap-3 text-xs text-gray-600 font-medium">
                      <div className="flex items-center justify-center gap-2 p-3 bg-blue-50 rounded-lg">
                        <IconTruck size={16} className="text-blue-600" stroke={2} />
                        <span>Envío gratis</span>
                      </div>
                      <div className="flex items-center justify-center gap-2 p-3 bg-green-50 rounded-lg">
                        <IconShield size={16} className="text-green-600" stroke={2} />
                        <span>Garantía 30 días</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="border-t border-gray-200 pt-6 text-center">
                <p className="text-xs text-gray-500 font-medium flex items-center justify-center gap-1.5">
                  <IconShield size={14} className="text-gray-400" stroke={2} />
                  Compra 100% segura y protegida con encriptación SSL 256-bit
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .swal-popup-professional {
          border-radius: 20px !important;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25) !important;
          border: none !important;
          padding: 32px 28px !important;
        }
        
        .swal-title-professional {
          font-size: 1.4rem !important;
          font-weight: 700 !important;
          color: #1F2937 !important;
          margin-bottom: 8px !important;
          margin-top: 0 !important;
          line-height: 1.3 !important;
        }

        .swal-title-professional-success {
          font-size: 1.4rem !important;
          font-weight: 700 !important;
          color: #16a34a !important;
          margin-bottom: 8px !important;
          margin-top: 0 !important;
          line-height: 1.3 !important;
        }
        
        .swal-html-professional {
          font-size: 0.95rem !important;
          color: #666 !important;
          line-height: 1.6 !important;
          margin: 0 !important;
          padding: 0 !important;
        }
        
        .swal-icon-error {
          border: 3px solid #C73838 !important;
          width: 72px !important;
          height: 72px !important;
          margin: 0 auto 20px !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          background: transparent !important;
          border-radius: 50% !important;
        }
        
        .swal-icon-success {
          border: 3px solid #16a34a !important;
          width: 72px !important;
          height: 72px !important;
          margin: 0 auto 20px !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          background: transparent !important;
          border-radius: 50% !important;
        }
        
        .swal-confirm-button-professional {
          background-color: #C73838 !important;
          border: none !important;
          border-radius: 12px !important;
          padding: 12px 40px !important;
          font-weight: 600 !important;
          font-size: 0.95rem !important;
          box-shadow: 0 4px 12px rgba(199, 56, 56, 0.25) !important;
          transition: all 0.3s ease !important;
          min-width: 160px !important;
        }
        
        .swal-confirm-button-professional:hover:not(:disabled) {
          background-color: #B11212 !important;
          box-shadow: 0 8px 20px rgba(199, 56, 56, 0.35) !important;
          transform: translateY(-2px) !important;
        }
        
        .swal-confirm-button-success {
          background-color: #16a34a !important;
          border: none !important;
          border-radius: 12px !important;
          padding: 12px 40px !important;
          font-weight: 600 !important;
          font-size: 0.95rem !important;
          box-shadow: 0 4px 12px rgba(22, 163, 74, 0.25) !important;
          transition: all 0.3s ease !important;
          min-width: 160px !important;
        }
        
        .swal-confirm-button-success:hover:not(:disabled) {
          background-color: #15803d !important;
          box-shadow: 0 8px 20px rgba(22, 163, 74, 0.35) !important;
          transform: translateY(-2px) !important;
        }
        
        .swal-container-professional {
          z-index: 10001 !important;
        }

        .swal2-title {
          padding: 0 !important;
        }

        .swal2-actions {
          gap: 12px !important;
          padding: 0 !important;
          margin-top: 24px !important;
          justify-content: center !important;
        }

        .swal2-icon {
          background: transparent !important;
          border: none !important;
        }
      `}</style>
    </>
  );
}
