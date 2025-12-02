"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "./button";
import { Input } from "./input";
import { Card } from "./card";
import AuthDialog from "../../auth/AuthDialog";
import OrderHistory from "../historial/page";

// --- Componente Avatar mejorado ---
function UserAvatar({ photo, username }: { photo?: string; username?: string }) {
  return (
    <div className="flex items-center gap-4">
      <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-fuchsia-500 to-purple-600 flex items-center justify-center shadow-xl overflow-hidden border-4 border-white">
        {photo ? (
          <img src={photo} alt="Avatar" className="w-full h-full object-cover" />
        ) : (
          <span className="text-4xl font-bold text-white">
            {username?.[0]?.toUpperCase() || "U"}
          </span>
        )}
      </div>
      <div>
        <div className="text-2xl font-bold text-gray-800">{username}</div>
        <div className="text-xs text-gray-500">Miembro desde 2024</div>
      </div>
    </div>
  );
}

// --- Componente para gestión de productos del vendedor (rediseñado) ---
function SellerProductManagement() {
  const [showForm, setShowForm] = useState(false);
  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [category, setCategory] = useState("");
  const [type, setType] = useState("");
  const [clasification, setClasification] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

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
        product_name: productName,
        price,
        stock,
        description,
        image_url: imageUrl,
        categories_input: [
          {
            element: category,
            type,
            clasification,
          },
        ],
      };
      const response = await fetch("https://suspicious-canid-dysai-ecommerce-b06e7d5a.koyeb.app/products/create/", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      if (!response.ok) throw new Error("No se pudo crear el producto.");
      setSuccess("Producto creado exitosamente.");
      setProductName("");
      setPrice("");
      setStock("");
      setDescription("");
      setImageUrl("");
      setCategory("");
      setType("");
      setClasification("");
    } catch (err: any) {
      setError(err.message || "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <Button
        onClick={() => setShowForm(!showForm)}
        className="mb-4 bg-gradient-to-r from-fuchsia-500 to-purple-500 hover:from-fuchsia-600 hover:to-purple-600 text-white font-semibold px-6 py-2 rounded-lg shadow"
      >
        {showForm ? "Ocultar formulario" : "Agregar producto"}
      </Button>
      {showForm && (
        <form
          className="space-y-4 bg-white/90 p-6 rounded-2xl shadow-xl max-w-2xl mx-auto border border-fuchsia-100"
          onSubmit={handleSubmit}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="font-semibold text-fuchsia-700">Nombre del producto</label>
              <Input value={productName} onChange={e => setProductName(e.target.value)} required />
            </div>
            <div>
              <label className="font-semibold text-fuchsia-700">Precio</label>
              <Input type="number" value={price} onChange={e => setPrice(e.target.value)} required />
            </div>
            <div>
              <label className="font-semibold text-fuchsia-700">Stock</label>
              <Input type="number" value={stock} onChange={e => setStock(e.target.value)} required />
            </div>
            <div>
              <label className="font-semibold text-fuchsia-700">URL de imagen</label>
              <Input value={imageUrl} onChange={e => setImageUrl(e.target.value)} required />
            </div>
            <div className="md:col-span-2">
              <label className="font-semibold text-fuchsia-700">Descripción</label>
              <Input value={description} onChange={e => setDescription(e.target.value)} required />
            </div>
            <div>
              <label className="font-semibold text-fuchsia-700">Categoría</label>
              <Input value={category} onChange={e => setCategory(e.target.value)} required />
            </div>
            <div>
              <label className="font-semibold text-fuchsia-700">Tipo</label>
              <Input value={type} onChange={e => setType(e.target.value)} required />
            </div>
            <div>
              <label className="font-semibold text-fuchsia-700">Clasificación</label>
              <Input value={clasification} onChange={e => setClasification(e.target.value)} required />
            </div>
          </div>
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-fuchsia-500 to-purple-500 hover:from-fuchsia-600 hover:to-purple-600 text-white font-semibold px-8 py-2 rounded-lg shadow"
          >
            {loading ? "Agregando..." : "Agregar producto"}
          </Button>
          {error && <div className="text-red-500 text-center">{error}</div>}
          {success && <div className="text-green-600 text-center">{success}</div>}
        </form>
      )}
    </div>
  );
}

// --- Página principal de perfil ---
export default function ProfilePage() {
  const router = useRouter();

  // --- Estados principales ---
  const [showProductManagement, setShowProductManagement] = useState(false);
  const [userData, setUserData] = useState<any>({
    id_user: "",
    document_type: "",
    username: "",
    cellphone: "",
    email: "",
    password: "",
    gender: "",
    age: "",
    address: "",
    photo: "",
    addresses_input: "",
    photos_input: "",
    id_seller: "",
    seller_name: "",
    insurance: "",
    rating: "",
  });
  const [editPersonal, setEditPersonal] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [errorProfile, setErrorProfile] = useState<string | null>(null);
  const [savingProfile, setSavingProfile] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [isSeller, setIsSeller] = useState(false);

  // --- Efecto para cargar perfil y autenticación ---
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const userToken = localStorage.getItem('token');
    const sellerToken = localStorage.getItem('sellerToken');
    let token = userToken || sellerToken;
    if (!token) {
      setShowAuthDialog(true);
      setCheckingAuth(false);
      return;
    }
    const fetchProfile = async () => {
      setLoadingProfile(true);
      setErrorProfile(null);
      try {
        let endpoint = '';
        let isSellerProfile = false;
        if (sellerToken && !userToken) {
          endpoint = 'https://suspicious-canid-dysai-ecommerce-b06e7d5a.koyeb.app/profile/seller/';
          isSellerProfile = true;
        } else {
          endpoint = 'https://suspicious-canid-dysai-ecommerce-b06e7d5a.koyeb.app/profile/user/';
        }
        const response = await fetch(endpoint, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (!response.ok) throw new Error('No se pudo obtener el perfil.');
        const data = await response.json();
        setIsSeller(isSellerProfile || data.user_type === "seller");
        if (isSellerProfile) {
          setUserData({
            id_seller: data.id_seller || '',
            document_type: data.document_type || '',
            seller_name: data.seller_name || '',
            cellphone: data.cellphone || '',
            email: data.email || '',
            password: '',
            gender: data.gender || '',
            age: data.age ? String(data.age) : '',
            address: data.address || '',
            insurance: data.insurance || '',
            rating: data.rating || '',
            photo: '',
            addresses_input: JSON.stringify(data.addresses_input || []),
            photos_input: JSON.stringify(data.photos_input || []),
          });
        } else {
          setUserData({
            id_user: data.id_user || '',
            document_type: data.document_type || '',
            username: data.username || '',
            cellphone: data.cellphone || '',
            email: data.email || '',
            password: '',
            gender: data.gender || '',
            age: data.age ? String(data.age) : '',
            address: data.address || '',
            photo: '',
            addresses_input: JSON.stringify(data.addresses_input || []),
            photos_input: JSON.stringify(data.photos_input || []),
          });
        }
      } catch (err: any) {
        setErrorProfile(err.message || 'Error desconocido');
      } finally {
        setLoadingProfile(false);
        setCheckingAuth(false);
      }
    };
    fetchProfile();
  }, [router]);

  // --- Handlers ---
  const handlePersonalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSaveProfile = async () => {
    setSavingProfile(true);
    setErrorProfile(null);
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('sellerToken');
      if (!token) {
        setErrorProfile('No autenticado. Inicia sesión para editar tu perfil.');
        setSavingProfile(false);
        return;
      }
      let endpoint = '';
      let body: any = {};
      if (isSeller) {
        endpoint = 'https://suspicious-canid-dysai-ecommerce-b06e7d5a.koyeb.app/profile/seller/update/';
        body = {
          id_seller: Number(userData.id_seller),
          document_type: userData.document_type,
          seller_name: userData.seller_name,
          cellphone: userData.cellphone,
          email: userData.email,
          password: userData.password,
          gender: userData.gender,
          age: Number(userData.age),
          insurance: userData.insurance,
          rating: userData.rating,
          addresses_input: JSON.parse(userData.addresses_input || '[]'),
          photos_input: JSON.parse(userData.photos_input || '[]'),
        };
      } else {
        endpoint = 'https://suspicious-canid-dysai-ecommerce-b06e7d5a.koyeb.app/profile/user/update/';
        body = {
          id_user: Number(userData.id_user),
          document_type: userData.document_type,
          username: userData.username,
          cellphone: userData.cellphone,
          email: userData.email,
          password: userData.password,
          gender: userData.gender,
          age: Number(userData.age),
          addresses_input: JSON.parse(userData.addresses_input || '[]'),
          photos_input: JSON.parse(userData.photos_input || '[]'),
        };
      }
      const response = await fetch(endpoint, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
      if (!response.ok) throw new Error('No se pudo guardar el perfil.');
      setEditPersonal(false);
    } catch (err: any) {
      setErrorProfile(err.message || 'Error desconocido');
    } finally {
      setSavingProfile(false);
    }
  };

  // --- Renderizado de autenticación ---
  if (checkingAuth) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-gradient-to-br from-fuchsia-100 to-purple-100">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-fuchsia-500"></div>
      </div>
    );
  }
  if (showAuthDialog) {
    const handleAuthDialogClose = (open: boolean) => {
      if (!open) {
        if (localStorage.getItem("token") || localStorage.getItem("sellerToken")) {
          setShowAuthDialog(false);
          setCheckingAuth(true);
          window.location.reload();
        } else {
          window.history.back();
        }
      }
    };
    return <AuthDialog open={showAuthDialog} onOpenChange={handleAuthDialogClose} showBackButton />;
  }

  // --- NUEVO DISEÑO ---
  return (
    <section className="flex justify-center w-full min-h-screen bg-gradient-to-br from-fuchsia-50 to-purple-50 pt-24 pb-10 px-2">
      <div className="flex flex-col gap-10 w-full max-w-5xl">
        {/* Encabezado de perfil */}
        <Card className="flex flex-col md:flex-row items-center md:items-start gap-8 p-8 shadow-xl border-0 bg-white/80 backdrop-blur rounded-2xl relative">
          <UserAvatar photo={userData.photo} username={userData.username || userData.seller_name} />
          <div className="flex-1 flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="text-lg font-semibold text-fuchsia-700">
                {isSeller ? "Vendedor" : "Usuario"}
              </span>
              {isSeller && (
                <span className="bg-fuchsia-100 text-fuchsia-700 px-2 py-1 rounded text-xs font-bold ml-2">
                  Seller
                </span>
              )}
            </div>
            <div className="text-gray-600">
              {userData.email}
            </div>
            <div className="flex gap-4 mt-4">
              <Button
                onClick={() => setEditPersonal(true)}
                className="bg-gradient-to-r from-fuchsia-500 to-purple-500 hover:from-fuchsia-600 hover:to-purple-600 text-white font-semibold px-6 py-2 rounded-lg shadow transition-all"
              >
                Editar perfil
              </Button>
              <Button
                className="border-fuchsia-400 text-fuchsia-700 hover:bg-fuchsia-50 font-semibold px-6 py-2 rounded-lg shadow"
                onClick={() => window.location.reload()}
              >
                Refrescar
              </Button>
            </div>
          </div>
        </Card>

        {/* Formulario de edición en modal */}
        {editPersonal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg relative animate-fade-in flex flex-col max-h-[90vh]">
              <h2 className="text-2xl font-bold text-fuchsia-700 mb-4 text-center pt-8 px-8">
                Editar Información Personal
              </h2>
              <form
                className="space-y-5 px-8 pb-8 overflow-y-auto"
                style={{ maxHeight: "70vh" }}
                onSubmit={e => {
                  e.preventDefault();
                  handleSaveProfile();
                }}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">ID Vendedor</label>
                    <Input name="id_seller" value={userData.id_seller} onChange={handlePersonalChange} required />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Nombre de vendedor</label>
                    <Input name="seller_name" value={userData.seller_name} onChange={handlePersonalChange} required />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Tipo de documento</label>
                    <Input name="document_type" value={userData.document_type} onChange={handlePersonalChange} required />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Celular</label>
                    <Input name="cellphone" value={userData.cellphone} onChange={handlePersonalChange} required />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Email</label>
                    <Input name="email" type="email" value={userData.email} onChange={handlePersonalChange} required />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Contraseña</label>
                    <Input name="password" type="password" value={userData.password} onChange={handlePersonalChange} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Género</label>
                    <Input name="gender" value={userData.gender} onChange={handlePersonalChange} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Edad</label>
                    <Input name="age" type="number" value={userData.age} onChange={handlePersonalChange} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Seguro</label>
                    <Input name="insurance" value={userData.insurance} onChange={handlePersonalChange} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Rating</label>
                    <Input name="rating" value={userData.rating} onChange={handlePersonalChange} />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Direcciones</label>
                  <Input
                    name="addresses_input"
                    value={userData.addresses_input}
                    onChange={handlePersonalChange}
                    placeholder=''
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Fotos</label>
                  <Input
                    name="photos_input"
                    value={userData.photos_input}
                    onChange={handlePersonalChange}
                    placeholder=''
                  />
                </div>
                <div className="flex gap-4 justify-center mt-6">
                  <Button
                    type="submit"
                    disabled={savingProfile}
                    className="bg-gradient-to-r from-fuchsia-500 to-purple-500 hover:from-fuchsia-600 hover:to-purple-600 text-white font-semibold px-8 py-2 rounded-lg shadow"
                  >
                    {savingProfile ? "Guardando..." : "Guardar"}
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setEditPersonal(false)}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold px-8 py-2 rounded-lg shadow"
                  >
                    Cancelar
                  </Button>
                </div>
                {errorProfile && (
                  <div className="text-red-500 text-center mt-2">{errorProfile}</div>
                )}
              </form>
            </div>
          </div>
        )}

        {/* Historial de pedidos */}
        <Card className="p-6 shadow-lg border-0 bg-white/80 backdrop-blur rounded-2xl">
          <h2 className="text-xl font-bold text-purple-700 mb-4">Historial de Pedidos</h2>
          <OrderHistory />
        </Card>

        {/* Gestión de productos para vendedores */}
        {isSeller && (
          <Card className="p-6 shadow-lg border-0 bg-white/80 backdrop-blur rounded-2xl space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-purple-700">Gestión de Productos</h2>
              <Button
                onClick={() => setShowProductManagement(!showProductManagement)}
                className="bg-gradient-to-r from-fuchsia-500 to-purple-500 hover:from-fuchsia-600 hover:to-purple-600 text-white font-semibold px-6 py-2 rounded-lg shadow"
              >
                {showProductManagement ? "Ocultar" : "Agregar"}
              </Button>
            </div>
            {showProductManagement && <SellerProductManagement />}
          </Card>
        )}
      </div>
    </section>
  );
}

