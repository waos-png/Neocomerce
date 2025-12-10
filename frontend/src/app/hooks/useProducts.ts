import useSWR from 'swr';
import { useEffect, useState } from 'react';
import { Product } from '../types/product';

const mockProducts: Product[] = [
  {
    id: 1,
    product_name: "iPhone 14 Pro",
    description: "Nuevo modelo 2025, Display Super Retina XDR, A16 Bionic chip",
    price: 3499000,
    image_url: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-14-pro-model-unselect-gallery-1-202209?wid=5120&hei=2880&fmt=jpeg&qlt=80&.v=1660753619946",
    categories: [
      { id_product_category: 1, element: "Tecnología", type: "Electrónica", clasification: "Premium" }
    ],
    stock: 10,
    rating: 4.8
  },
  {
    id: 2,
    product_name: "Zapatillas Nike",
    description: "Edición limitada para runners",
    price: 150000,
    image_url: "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/1c9e6c7e-2e1e-4e7e-9e2d-7c3e2b2e2e2e/air-zoom-pegasus-39-zapatillas-running.jpg",
    categories: [
      { id_product_category: 2, element: "Moda", type: "Calzado", clasification: "Deportivo" }
    ],
    stock: 25,
    rating: 4.5
  },
  {
    id: 3,
    product_name: "Silla Gamer RGB",
    description: "Con luces LED y soporte lumbar",
    price: 2500000,
    image_url: "https://www.ikea.com/co/es/images/products/matchspel-silla-gaming-negro__0724716_pe734892_s5.jpg",
    categories: [
      { id_product_category: 3, element: "Hogar", type: "Muebles", clasification: "Gamer" }
    ],
    stock: 5,
    rating: 4.9
  },
  {
    id: 4,
    product_name: "Smartwatch Galaxy",
    description: "Elegante y funcional",
    price: 200000,
    image_url: "https://images.samsung.com/is/image/samsung/p6pim/co/2208/gallery/co-galaxy-watch5-44mm-sm-r910nzsacoo-533465601?$650_519_PNG$",
    categories: [
      { id_product_category: 1, element: "Tecnología", type: "Wearable", clasification: "Smart" }
    ],
    stock: 15,
    rating: 4.6
  },
  {
    id: 5,
    product_name: "Robot Aspirador Xiaomi",
    description: "Limpieza automática inteligente",
    price: 1220000,
    image_url: "https://cdn.idealo.com/folder/Product/200393/7/200393782/s11_produktbild_gross/xiaomi-mi-robot-vacuum-mop-2-pro.jpg",
    categories: [
      { id_product_category: 4, element: "Hogar", type: "Electrodoméstico", clasification: "Smart" }
    ],
    stock: 8,
    rating: 4.7
  },
  {
    id: 6,
    product_name: "Camiseta Adidas Originals",
    description: "100% algodón, diseño clásico",
    price: 85000,
    image_url: "https://assets.adidas.com/images/w_600,f_auto,q_auto/3a1e2e4e2b2e4e7e9e2d7c3e2b2e2e2e_9366/Camiseta_Adicolor_Classics_Trefoil_Blanco_GN3495_01_laydown.jpg",
    categories: [
      { id_product_category: 2, element: "Moda", type: "Ropa", clasification: "Casual" }
    ],
    stock: 30,
    rating: 4.3
  },
  {
    id: 7,
    product_name: "Set de Pesas Ajustables",
    description: "Para entrenamiento en casa",
    price: 180000,
    image_url: "https://falabella.scene7.com/is/image/FalabellaCO/110314186_1?wid=800&hei=800&qlt=70",
    categories: [
      { id_product_category: 5, element: "Deportes", type: "Accesorios", clasification: "Fitness" }
    ],
    stock: 12,
    rating: 4.4
  },
  {
    id: 8,
    product_name: "Nintendo Switch OLED",
    description: "Consola híbrida de última generación",
    price: 1799000,
    image_url: "https://m.media-amazon.com/images/I/61-PblYntsL._AC_SL1500_.jpg",
    categories: [
      { id_product_category: 6, element: "Videojuegos", type: "Consola", clasification: "Premium" }
    ],
    stock: 7,
    rating: 4.9
  },
  {
    id: 9,
    product_name: "Perfume Dior Sauvage",
    description: "Fragancia masculina intensa",
    price: 420000,
    image_url: "https://www.dior.com/couture/ecommerce/media/catalog/product/2/9/292C1B2A-7A1A-4B7B-9B2A-7A1A4B7B9B2A_1.jpg",
    categories: [
      { id_product_category: 7, element: "Belleza", type: "Perfume", clasification: "Lujo" }
    ],
    stock: 18,
    rating: 4.7
  },
  {
    id: 10,
    product_name: "Lámpara LED Escritorio",
    description: "Luz regulable y puerto USB",
    price: 65000,
    image_url: "https://www.linio.com.co/p/lampara-led-de-escritorio-con-usb-blanco-yl6w3p",
    categories: [
      { id_product_category: 4, element: "Hogar", type: "Iluminación", clasification: "Oficina" }
    ],
    stock: 22,
    rating: 4.2
  },
  {
    id: 11,
    product_name: "Bicicleta GW Alligator",
    description: "Montañera, 21 velocidades",
    price: 950000,
    image_url: "https://www.gwbicycles.com/wp-content/uploads/2021/03/ALLIGATOR-NEGRO-ROJO.png",
    categories: [
      { id_product_category: 5, element: "Deportes", type: "Bicicleta", clasification: "Montaña" }
    ],
    stock: 6,
    rating: 4.6
  },
  {
    id: 12,
    product_name: "Set de Brochas de Maquillaje",
    description: "12 piezas, cerdas sintéticas",
    price: 35000,
    image_url: "https://falabella.scene7.com/is/image/FalabellaCO/110314187_1?wid=800&hei=800&qlt=70",
    categories: [
      { id_product_category: 7, element: "Belleza", type: "Accesorios", clasification: "Maquillaje" }
    ],
    stock: 40,
    rating: 4.5
  },
  {
    id: 13,
    product_name: "Cama para Mascotas",
    description: "Suave, lavable y antideslizante",
    price: 60000,
    image_url: "https://www.linio.com.co/p/cama-para-mascotas-suave-lavable-antideslizante-azul-yl6w3p",
    categories: [
      { id_product_category: 8, element: "Mascotas", type: "Cama", clasification: "Confort" }
    ],
    stock: 20,
    rating: 4.8
  },
  {
    id: 14,
    product_name: "Monitor LG UltraWide 29''",
    description: "Pantalla IPS Full HD",
    price: 899000,
    image_url: "https://www.lg.com/co/images/monitores/md07552938/gallery/medium01.jpg",
    categories: [
      { id_product_category: 1, element: "Tecnología", type: "Monitor", clasification: "Oficina" }
    ],
    stock: 9,
    rating: 4.7
  },
  {
    id: 15,
    product_name: "Cafetera Oster Programable",
    description: "12 tazas, filtro permanente",
    price: 210000,
    image_url: "https://www.ostercolombia.com/media/catalog/product/cache/1/image/800x800/9df78eab33525d08d6e5fb8d27136e95/c/a/cafetera-oster-programable-12-tazas.jpg",
    categories: [
      { id_product_category: 4, element: "Hogar", type: "Electrodoméstico", clasification: "Cocina" }
    ],
    stock: 13,
    rating: 4.4
  },
  {
    id: 16,
    product_name: "Balón de Baloncesto Spalding",
    description: "Tamaño oficial, caucho resistente",
    price: 75000,
    image_url: "https://www.spalding.com.co/media/catalog/product/cache/1/image/800x800/9df78eab33525d08d6e5fb8d27136e95/b/a/balon-baloncesto-spalding.jpg",
    categories: [
      { id_product_category: 5, element: "Deportes", type: "Balón", clasification: "Competencia" }
    ],
    stock: 17,
    rating: 4.6
  },
  {
    id: 17,
    product_name: "Collar Antipulgas para Perros",
    description: "Protección hasta 8 meses",
    price: 32000,
    image_url: "https://www.linio.com.co/p/collar-antipulgas-para-perros-proteccio-n-8-meses-yl6w3p",
    categories: [
      { id_product_category: 8, element: "Mascotas", type: "Accesorio", clasification: "Salud" }
    ],
    stock: 35,
    rating: 4.3
  },
  {
    id: 18,
    product_name: "Set de Ollas Antiadherentes",
    description: "5 piezas, aptas para inducción",
    price: 185000,
    image_url: "https://falabella.scene7.com/is/image/FalabellaCO/110314188_1?wid=800&hei=800&qlt=70",
    categories: [
      { id_product_category: 4, element: "Hogar", type: "Cocina", clasification: "Premium" }
    ],
    stock: 11,
    rating: 4.5
  },
  {
    id: 20,
    product_name: "Juego de Sábanas Microfibra",
    description: "Suaves, frescas y resistentes",
    price: 69000,
    image_url: "https://www.linio.com.co/p/juego-de-sa-banas-microfibra-suaves-frescas-yl6w3p",
    categories: [
      { id_product_category: 4, element: "Hogar", type: "Ropa de cama", clasification: "Confort" }
    ],
    stock: 27,
    rating: 4.4
  },
  {
    id: 21,
    product_name: "Tablet Samsung Galaxy Tab A8",
    description: "Pantalla 10.5'', 64GB",
    price: 899000,
    image_url: "https://images.samsung.com/is/image/samsung/p6pim/co/2208/gallery/co-galaxy-tab-a8-x200-sm-x200nzaalto-533465601?$650_519_PNG$",
    categories: [
      { id_product_category: 1, element: "Tecnología", type: "Tablet", clasification: "Familiar" }
    ],
    stock: 14,
    rating: 4.6
  },
  {
    id: 22,
    product_name: "Set de Maletas Viaje",
    description: "3 piezas, expandibles",
    price: 320000,
    image_url: "https://falabella.scene7.com/is/image/FalabellaCO/110314189_1?wid=800&hei=800&qlt=70",
    categories: [
      { id_product_category: 2, element: "Moda", type: "Accesorios", clasification: "Viaje" }
    ],
    stock: 16,
    rating: 4.5
  },
  {
    id: 23,
    product_name: "Gafas de Sol Ray-Ban",
    description: "Protección UV400, diseño clásico",
    price: 210000,
    image_url: "https://www.ray-ban.com/colombia/media/catalog/product/cache/1/image/800x800/9df78eab33525d08d6e5fb8d27136e95/r/b/rb2132-901-58.png",
    categories: [
      { id_product_category: 2, element: "Moda", type: "Accesorios", clasification: "Casual" }
    ],
    stock: 19,
    rating: 4.7
  }
];

const fetcher = (url: string) => fetch(url).then(res => res.json());

export function useProducts(search?: string) {
  const { data, error, isLoading } = useSWR<Product[]>(
    `http://localhost:8080/products${search ? `?search=${search}` : ''}`,
    fetcher
  );
  const [timeoutReached, setTimeoutReached] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => setTimeoutReached(true), 2000); // 2 segundos
    return () => clearTimeout(timer);
  }, []);

  // Filtrar productos mock si hay búsqueda
  const filteredMock = search
    ? mockProducts.filter(p =>
        p.product_name?.toLowerCase().includes(search.toLowerCase()) ||
        p.description?.toLowerCase().includes(search.toLowerCase())
      )
    : mockProducts;

  return {
    products:
      (data && data.length > 0 && !error) ? data :
      (error || timeoutReached) ? filteredMock : [],
    isLoading: isLoading && !timeoutReached,
    error,
  };
}