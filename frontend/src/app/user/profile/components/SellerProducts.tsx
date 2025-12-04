"use client";
import React, { useState } from "react";
import { Button } from "../../components/Button";
import { Input } from "../../components/Input";
import { ProductInput } from "../../types/user";
import { IconPlus, IconX, IconCheck } from "@tabler/icons-react";
import { createProduct } from "../../lib/userApi";

export function SellerProducts() {
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [formData, setFormData] = useState<ProductInput>({
    product_name: "",
    price: "",
    stock: "",
    description: "",
    image_url: "",
    category: "",
    type: "",
    clasification: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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

      const body = {
        id_provider: 1,
        product_name: formData.product_name,
        price: formData.price,
        stock: formData.stock,
        description: formData.description,
        image_url: formData.image_url,
        categories_input: [
          {
            element: formData.category,
            type: formData.type,
            clasification: formData.clasification,
          },
        ],
      };

      await createProduct(body);

      setSuccess("Producto creado exitosamente.");
      setFormData({
        product_name: "",
        price: "",
        stock: "",
        description: "",
        image_url: "",
        category: "",
        type: "",
        clasification: "",
      });
      setShowForm(false);
    } catch (err: any) {
      setError(err.message || "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full space-y-4">
      <button
        onClick={() => setShowForm(!showForm)}
        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold rounded-lg shadow-lg transition-all"
      >
        <IconPlus size={20} />
        {showForm ? "Cancelar" : "Agregar producto"}
      </button>

      {showForm && (
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
                placeholder="Ej: Laptop Dell"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-red-700 mb-2">Precio</label>
              <Input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="0"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-red-700 mb-2">Stock</label>
              <Input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                placeholder="0"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-red-700 mb-2">
                URL de imagen
              </label>
              <Input
                name="image_url"
                value={formData.image_url}
                onChange={handleChange}
                placeholder="https://..."
                required
              />
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
                className="w-full px-4 py-2 rounded-lg border border-red-300 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500 shadow-sm"
                rows={3}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-red-700 mb-2">Categoría</label>
              <Input
                name="category"
                value={formData.category}
                onChange={handleChange}
                placeholder="Ej: Electrónica"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-red-700 mb-2">Tipo</label>
              <Input
                name="type"
                value={formData.type}
                onChange={handleChange}
                placeholder="Ej: Computadoras"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-red-700 mb-2">
                Clasificación
              </label>
              <Input
                name="clasification"
                value={formData.clasification}
                onChange={handleChange}
                placeholder="Ej: Premium"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
          >
            <IconCheck size={20} />
            {loading ? "Agregando..." : "Agregar producto"}
          </button>

          {error && (
            <div className="p-3 bg-red-100 text-red-700 rounded-lg flex items-center gap-2">
              <IconX size={18} />
              {error}
            </div>
          )}
          {success && (
            <div className="p-3 bg-green-100 text-green-700 rounded-lg flex items-center gap-2">
              <IconCheck size={18} />
              {success}
            </div>
          )}
        </form>
      )}
    </div>
  );
}