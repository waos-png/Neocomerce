"use client";
import React, { useState, useEffect } from "react";
import { Button } from "../../components/Button";
import { Input } from "../../components/Input";
import { IconPlus, IconX, IconCheck, IconTrash } from "@tabler/icons-react";
import { createProduct } from "../../lib/userApi";

interface Category {
  id: number;
  name: string;
  type?: string;
}

interface Product {
  id: number;
  productName: string;
  price: number;
  stock: number;
  imageUrl?: string;
}

interface ProductInput {
  product_name: string;
  price: string | number;
  stock: string | number;
  description: string;
  imageUrl: string;
  categoryId: string;
}

// Props para controlar si mostrar el formulario/btn de agregar
interface SellerProductsProps {
  allowAdd?: boolean;
}

export function SellerProducts({ allowAdd = true }: SellerProductsProps) {
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [productsLoading, setProductsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [userId, setUserId] = useState<number | null>(null);
  const [sellerId, setSellerId] = useState<number | null>(null);

  const [formData, setFormData] = useState<ProductInput>({
    product_name: "",
    price: "",
    stock: "",
    description: "",
    imageUrl: "",
    categoryId: "",
  });

  // Cargar usuario, vendedor, categorías y productos al montar
  useEffect(() => {
    loadUserAndData();
  }, []);

  const loadUserAndData = async () => {
    try {
      // Obtener usuario del localStorage
      const userStr = localStorage.getItem("user");
      if (userStr) {
        const user = JSON.parse(userStr);
        setUserId(user.id);

        // Cargar datos del vendedor y sus productos
        await loadSellerAndProducts(user.id);
      }

      // Cargar categorías
      await loadCategories();
    } catch (err) {
      console.error("Error cargando datos:", err);
    }
  };

  const loadSellerAndProducts = async (userId: number) => {
    try {
      const token = localStorage.getItem("token") || localStorage.getItem("sellerToken");
      const apiBase = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8080";

      // Obtener datos del vendedor
      const sellerRes = await fetch(
        `${apiBase}/vendedores/by-user?usuarioId=${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (sellerRes.ok) {
        const seller = await sellerRes.json();
        setSellerId(seller.id);

        // Cargar productos del vendedor
        const productsRes = await fetch(
          `${apiBase}/products?vendedorId=${seller.id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (productsRes.ok) {
          const prods = await productsRes.json();
          setProducts(Array.isArray(prods) ? prods : []);
        }
      }
    } catch (err) {
      console.error("Error cargando vendedor y productos:", err);
    } finally {
      setProductsLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const token = localStorage.getItem("token") || localStorage.getItem("sellerToken");
      const apiBase = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8080";

      const response = await fetch(`${apiBase}/categorias`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (err) {
      console.error("Error cargando categorías:", err);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const token = localStorage.getItem("sellerToken") || localStorage.getItem("token");
      if (!token) {
        setError("No autenticado. Inicia sesión como vendedor.");
        setLoading(false);
        return;
      }

      if (!userId) {
        setError("Error: No se pudo obtener el ID del usuario.");
        setLoading(false);
        return;
      }

      if (!formData.categoryId) {
        setError("Debes seleccionar una categoría.");
        setLoading(false);
        return;
      }

      const body = {
        productName: formData.product_name,
        description: formData.description,
        price: parseFloat(String(formData.price)),
        imageUrl: formData.imageUrl,
        rating: 0,
        stock: parseInt(String(formData.stock)),
        sellerId: userId,
        categoryIds: [parseInt(formData.categoryId)],
        activo: true,
      };

      await createProduct(body);

      setSuccess("Producto creado exitosamente.");
      setFormData({
        product_name: "",
        price: "",
        stock: "",
        description: "",
        imageUrl: "",
        categoryId: "",
      });
      setShowForm(false);

      // Recargar productos
      if (userId) await loadSellerAndProducts(userId);
    } catch (err: any) {
      setError(err.message || "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full space-y-4">
      {allowAdd && (
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold rounded-lg shadow-lg transition-all"
        >
          <IconPlus size={20} />
          {showForm ? "Cancelar" : "Agregar producto"}
        </button>
      )}

      {error && (
        <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="p-3 bg-green-100 text-green-700 rounded-lg text-sm">
          {success}
        </div>
      )}

      {allowAdd && showForm && (
        <form
          className="space-y-4 bg-gradient-to-br from-red-50 to-orange-50 p-6 rounded-2xl shadow-xl border border-red-200"
          onSubmit={handleSubmit}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-red-700 mb-2">
                Nombre del producto
              </label>
              <Input
                name="product_name"
                value={formData.product_name}
                onChange={handleChange}
                placeholder="Ej: Apple AirPods Pro"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-red-700 mb-2">
                Precio
              </label>
              <Input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="249.00"
                step="0.01"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-red-700 mb-2">
                Stock
              </label>
              <Input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                placeholder="150"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-red-700 mb-2">
                Categoría
              </label>
              <select
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-red-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                required
              >
                <option value="">Selecciona una categoría</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-red-700 mb-2">
                Descripción
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe tu producto..."
                rows={3}
                className="w-full px-4 py-2 border border-red-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-red-700 mb-2">
                URL de imagen
              </label>
              <Input
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                placeholder="https://ejemplo.com/imagen.jpg"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              onClick={() => setShowForm(false)}
              variant="outline"
            >
              Cancelar
            </Button>
            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? "Guardando..." : "Crear producto"}
            </Button>
          </div>
        </form>
      )}

      {/* Productos existentes */}
      <div className="space-y-4">
        <h4 className="text-sm font-bold text-gray-900">
          {productsLoading ? "Cargando productos..." : `${products.length} productos`}
        </h4>

        {!productsLoading && products.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-4">
            No tienes productos aún. ¡Comienza a agregar!
          </p>
        ) : (
          <ul className="space-y-2 max-h-80 overflow-y-auto">
            {products.map((prod) => (
              <li
                key={prod.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
              >
                <div>
                  <p className="font-semibold text-gray-900">{prod.productName}</p>
                  <p className="text-xs text-gray-600">
                    ${prod.price} • Stock: {prod.stock}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                    Activo
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}