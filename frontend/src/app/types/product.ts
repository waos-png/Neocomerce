export interface CategoryObj {
  id: number;
  name: string;
  type: string;
  classification: string;
}

export interface VendorInfo {
  id: number;
  nombreTienda: string;
  verificado: boolean;
}

export interface Product {
  id: number;
  productName: string;
  description: string;
  price: number;
  imageUrl: string;
  rating: number;
  stock: number;
  activo: boolean;
  vendedor: VendorInfo;
  categorias: CategoryObj[];
  creadoEn: string;
  actualizadoEn: string;
}