/**
 * Componente ProductSkeleton
 * Muestra un placeholder de carga para productos
 * Se utiliza mientras se cargan los datos desde la API
 * 
 * @returns Esqueleto animado de producto
 */
export function ProductSkeleton() {
  return (
    <div className="space-y-4">
      {/* Imagen placeholder */}
      <div className="animate-pulse bg-gradient-to-r from-red-50 to-red-100 rounded-xl h-64 w-full" />
      
      {/* Título placeholder */}
      <div className="space-y-2">
        <div className="animate-pulse bg-red-100 rounded-lg h-4 w-3/4" />
        <div className="animate-pulse bg-red-50 rounded-lg h-4 w-1/2" />
      </div>

      {/* Descripción placeholder */}
      <div className="space-y-2">
        <div className="animate-pulse bg-red-50 rounded-lg h-3 w-full" />
        <div className="animate-pulse bg-red-50 rounded-lg h-3 w-5/6" />
      </div>

      {/* Precio placeholder */}
      <div className="flex justify-between items-end">
        <div className="animate-pulse bg-red-200 rounded-lg h-5 w-24" />
        <div className="animate-pulse bg-gradient-to-r from-[#C73838] to-[#B11212] rounded-lg h-8 w-20" />
      </div>
    </div>
  );
}
