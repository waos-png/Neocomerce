"use client";
import React, { useState } from "react";
import { Button } from "../../components/Button";
import { Input } from "../../components/Input";
import { UserData, SellerData } from "../../types/user";

interface ProfileFormProps {
  userData: UserData | SellerData;
  isSeller: boolean;
  onSave: (data: UserData | SellerData) => Promise<void>;
  onCancel: () => void;
  saving: boolean;
  error?: string | null;
}

export function ProfileForm({ userData, isSeller, onSave, onCancel, saving, error }: ProfileFormProps) {
  const [formData, setFormData] = useState(userData);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg relative animate-fade-in flex flex-col max-h-[90vh]">
        <h2 className="text-2xl font-bold text-red-700 mb-4 text-center pt-8 px-8">
          Editar Información Personal
        </h2>
        <form
          className="space-y-5 px-8 pb-8 overflow-y-auto"
          style={{ maxHeight: "70vh" }}
          onSubmit={handleSubmit}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {isSeller && (
              <>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">ID Vendedor</label>
                  <Input name="id_seller" value={(formData as SellerData).id_seller || ""} onChange={handleChange} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Nombre vendedor</label>
                  <Input name="seller_name" value={(formData as SellerData).seller_name || ""} onChange={handleChange} />
                </div>
              </>
            )}
            {!isSeller && (
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Nombre de usuario</label>
                <Input name="username" value={(formData as UserData).username || ""} onChange={handleChange} />
              </div>
            )}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Email</label>
              <Input name="email" type="email" value={formData.email || ""} onChange={handleChange} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Celular</label>
              <Input name="cellphone" value={formData.cellphone || ""} onChange={handleChange} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Contraseña</label>
              <Input name="password" type="password" value={formData.password || ""} onChange={handleChange} />
            </div>
          </div>

          <div className="flex gap-4 justify-center mt-6">
            <Button
              type="submit"
              disabled={saving}
              className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white"
            >
              {saving ? "Guardando..." : "Guardar"}
            </Button>
            <Button
              type="button"
              onClick={onCancel}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700"
            >
              Cancelar
            </Button>
          </div>
          {error && <div className="text-red-500 text-center mt-2">{error}</div>}
        </form>
      </div>
    </div>
  );
}