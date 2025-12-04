export interface UserData {
  id_user?: string;
  document_type?: string;
  username?: string;
  cellphone?: string;
  email?: string;
  password?: string;
  gender?: string;
  age?: string;
  address?: string;
  photo?: string;
  addresses_input?: string;
  photos_input?: string;
}

export interface SellerData extends UserData {
  id_seller?: string;
  seller_name?: string;
  insurance?: string;
  rating?: string;
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