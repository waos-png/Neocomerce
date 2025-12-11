// Usuario según DTO backend
export interface UserData {
  id?: number;
  documentNumber?: number;
  documentType?: string;
  email?: string;
  username?: string;
  cellphone?: string;
  gender?: string;
  age?: number;
  rol?: string;
  activo?: boolean;
  photo?: string;
}

// Vendedor hereda de Usuario y añade campos de vendedor
export interface SellerData extends UserData {
  usuarioId?: number;
  nombreTienda?: string;
  nitORfc?: string;
  telefono?: string;
  direccion?: string;
  ciudad?: string;
  pais?: string;
  verificado?: boolean;
}

export interface Order {
  id?: string | number;
  details?: string;
  product_name?: string;
  date?: string;
  created_at?: string;
  total?: number;
  price?: number;
  status?: string;
}

export interface ProductInput {
  product_name: string;
  price: string | number;
  stock: string | number;
  description: string;
  image_url: string;
  category: string;
  type: string;
  clasification: string;
}