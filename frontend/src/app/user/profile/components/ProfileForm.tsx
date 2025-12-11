"use client";
import React, { useState, useEffect } from "react";
import { Button } from "../../components/Button";
import { Input } from "../../components/Input";
import { UserData, SellerData } from "../../types/user";
import { IconX, IconUser, IconBriefcase } from "@tabler/icons-react";

interface ProfileFormProps {
  userData?: UserData | null;
  sellerData?: SellerData | null;
  isSeller: boolean;
  onSave: (data: any) => Promise<void>;
  onCancel: () => void;
  saving: boolean;
  error?: string | null;
}

export function ProfileForm({ userData, sellerData, isSeller, onSave, onCancel, saving, error }: ProfileFormProps) {
  const [userForm, setUserForm] = useState({
    username: userData?.username || "",
    cellphone: userData?.cellphone || "",
    gender: userData?.gender || "",
    age: userData?.age || "",
  });

  const [sellerForm, setSellerForm] = useState({
    nombreTienda: sellerData?.nombreTienda || "",
    nitORfc: sellerData?.nitORfc || "",
    telefono: sellerData?.telefono || "",
    direccion: sellerData?.direccion || "",
    ciudad: sellerData?.ciudad || "",
    pais: sellerData?.pais || "",
  });

  useEffect(() => {
    setUserForm({
      username: userData?.username || "",
      cellphone: userData?.cellphone || "",
      gender: userData?.gender || "",
      age: userData?.age || "",
    });
  }, [userData]);

  useEffect(() => {
    setSellerForm({
      nombreTienda: sellerData?.nombreTienda || "",
      nitORfc: sellerData?.nitORfc || "",
      telefono: sellerData?.telefono || "",
      direccion: sellerData?.direccion || "",
      ciudad: sellerData?.ciudad || "",
      pais: sellerData?.pais || "",
    });
  }, [sellerData]);

  const handleUserChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setUserForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSellerChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSellerForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSeller) {
      const payload = {
        nombreTienda: sellerForm.nombreTienda || undefined,
        nitORfc: sellerForm.nitORfc || undefined,
        telefono: sellerForm.telefono || undefined,
        direccion: sellerForm.direccion || undefined,
        ciudad: sellerForm.ciudad || undefined,
        pais: sellerForm.pais || undefined,
      };
      await onSave(payload);
    } else {
      const payload = {
        username: userForm.username || undefined,
        cellphone: userForm.cellphone || undefined,
        gender: userForm.gender || undefined,
        age: userForm.age ? Number(userForm.age) : undefined,
      };
      await onSave(payload);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-red-700 px-8 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {isSeller ? (
              <IconBriefcase size={28} className="text-white" />
            ) : (
              <IconUser size={28} className="text-white" />
            )}
            <h2 className="text-2xl font-bold text-white">
              {isSeller ? "Editar Perfil de Vendedor" : "Editar Perfil"}
            </h2>
          </div>
          <button
            onClick={onCancel}
            className="text-white hover:bg-red-700 p-2 rounded-lg transition"
          >
            <IconX size={24} />
          </button>
        </div>

        {/* Content */}
        <form className="overflow-y-auto flex-1 px-8 py-6 space-y-6" onSubmit={handleSubmit}>
          {!isSeller ? (
            // Usuario Form
            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Nombre de usuario</label>
                  <Input name="username" value={userForm.username} onChange={handleUserChange} placeholder="Tu nombre" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Celular</label>
                  <Input name="cellphone" value={userForm.cellphone} onChange={handleUserChange} placeholder="Tu celular" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Género</label>
                  <select
                    name="gender"
                    value={userForm.gender}
                    onChange={handleUserChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500"
                  >
                    <option value="">No especificado</option>
                    <option value="MASCULINO">Masculino</option>
                    <option value="FEMENINO">Femenino</option>
                    <option value="OTRO">Otro</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Edad</label>
                  <Input name="age" type="number" value={userForm.age as any} onChange={handleUserChange} placeholder="Tu edad" />
                </div>
              </div>
            </div>
          ) : (
            // Vendedor Form
            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Nombre de la tienda</label>
                  <Input name="nombreTienda" value={sellerForm.nombreTienda} onChange={handleSellerChange} placeholder="Mi tienda" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">NIT / RFC</label>
                  <Input name="nitORfc" value={sellerForm.nitORfc} onChange={handleSellerChange} placeholder="123456789" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Teléfono</label>
                  <Input name="telefono" value={sellerForm.telefono} onChange={handleSellerChange} placeholder="Tu teléfono" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Dirección</label>
                  <Input name="direccion" value={sellerForm.direccion} onChange={handleSellerChange} placeholder="Calle 123" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Ciudad</label>
                  <Input name="ciudad" value={sellerForm.ciudad} onChange={handleSellerChange} placeholder="Bogotá" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">País</label>
                  <Input name="pais" value={sellerForm.pais} onChange={handleSellerChange} placeholder="Colombia" />
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-6 border-t">
            <Button type="submit" variant="primary" disabled={saving} className="flex-1">
              {saving ? "Guardando..." : "Guardar cambios"}
            </Button>
            <Button type="button" variant="secondary" onClick={onCancel} className="flex-1">
              Cancelar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}