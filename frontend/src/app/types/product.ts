export interface CategoryObj {
  id_product_category?: number;
  element?: string;
  type?: string;
  clasification?: string;
}

export interface Product {
  id: number;
  product_name?: string;
  name?: string;
  description?: string;
  price?: number | string;
  image_url?: string;
  image?: string;
  categories?: CategoryObj[]; // <-- Debe ser array de objetos
  category?: string;
  rating?: number;
  stock?: number;
  seller?: {
    id: string | number;
    name: string;
    email?: string;
  };
  // ...otros campos
}