"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// Components
import { Button } from "../components/Button";
import { Card, CardHeader, CardContent } from "../components/Card";
import { UserAvatar } from "../components/UserAvatar";
import { ProfileForm } from "./components/ProfileForm";
import { SellerProducts } from "./components/SellerProducts";
import { OrderList } from "../historial/components/OrderList";

// Hooks & Types
import { useProfileData } from "../hooks/useProfileData";
import AuthDialog from "../../auth/AuthDialog";
import { SellerData } from "../types/user";

// Icons
import {
  IconLoader2,
  IconMail,
  IconPhone,
  IconShield,
  IconBriefcase,
  IconPackage,
  IconMapPin,
  IconUser,
  IconId,
  IconWorld,
  IconShoppingCart,
  IconCurrencyDollar,
} from "@tabler/icons-react";

// API
import * as userApi from "../lib/userApi";

/* -----------------------------------------------------------
   UTILS
----------------------------------------------------------- */

const moneyFmt = (v: number) =>
  new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(v);

/* -----------------------------------------------------------
   MAIN COMPONENT
----------------------------------------------------------- */

export default function ProfilePage() {
  const router = useRouter();
  const { userData, loading, error, isSeller, updateProfile, refetch } = useProfileData();

  const [editPersonal, setEditPersonal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const [sellerData, setSellerData] = useState<SellerData | null>(null);
  const [sellerLoading, setSellerLoading] = useState(false);

  const [ordersCount, setOrdersCount] = useState(0);
  const [totalSpent, setTotalSpent] = useState(0);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  const [showAuthDialog, setShowAuthDialog] = useState(() => {
    if (typeof window === "undefined") return false;
    return !localStorage.getItem("token") && !localStorage.getItem("sellerToken");
  });

  /* -----------------------------------------------------------
     LOAD SELLER DATA
  ----------------------------------------------------------- */
  useEffect(() => {
    if (isSeller && userData?.id) loadSeller();
  }, [isSeller, userData?.id]);

  const loadSeller = async () => {
    setSellerLoading(true);
    try {
      const resp = await userApi.fetchSellerByUser(userData?.id);
      setSellerData(resp || null);
    } catch (err) {
      console.error("Error cargando vendedor", err);
      setSellerData(null);
    } finally {
      setSellerLoading(false);
    }
  };

  /* -----------------------------------------------------------
     LOAD ORDERS
  ----------------------------------------------------------- */
  useEffect(() => {
    if (userData?.id) loadOrders();
    else {
      setOrdersCount(0);
      setTotalSpent(0);
      setRecentOrders([]);
    }
  }, [userData?.id]);

  const loadOrders = async () => {
    setOrdersLoading(true);
    try {
      const orders = (await userApi.fetchOrdersHistory()) || [];
      setOrdersCount(orders.length);
      setTotalSpent(
        orders.reduce((acc: number, o: any) => acc + Number(o?.total || 0), 0)
      );
      setRecentOrders(orders.slice(0, 3));
    } catch (err) {
      console.error("Error cargando pedidos", err);
      setOrdersCount(0);
      setTotalSpent(0);
      setRecentOrders([]);
    } finally {
      setOrdersLoading(false);
    }
  };

  /* -----------------------------------------------------------
     AUTH HANDLING
  ----------------------------------------------------------- */

  const handleAuthDialogClose = (open: boolean) => {
    if (!open) {
      if (localStorage.getItem("token") || localStorage.getItem("sellerToken")) {
        setShowAuthDialog(false);
        refetch();
      } else {
        router.back();
      }
    }
  };

  /* -----------------------------------------------------------
     SAVE PROFILE
  ----------------------------------------------------------- */

  const handleSaveProfile = async (data: any) => {
    setSaving(true);
    setFormError(null);

    try {
      if (isSeller) {
        if (!sellerData?.id) throw new Error("No se encontró vendedor");
        await userApi.updateSeller(sellerData.id, data);
        await loadSeller();
      } else {
        await updateProfile(data);
      }

      setEditPersonal(false);
    } catch (err: any) {
      setFormError(err.message || "Error al guardar cambios");
    } finally {
      setSaving(false);
    }
  };

  /* -----------------------------------------------------------
     LOADING STATES
  ----------------------------------------------------------- */

  if (loading && !userData) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <IconLoader2 size={48} className="text-red-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-semibold">Cargando perfil...</p>
        </div>
      </div>
    );
  }

  if (showAuthDialog)
    return <AuthDialog open={showAuthDialog} onOpenChange={handleAuthDialogClose} showBackButton />;

  if (error && !userData) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center max-w-md">
          <div className="text-red-600 text-6xl mb-4">⚠️</div>
          <p className="text-red-700 font-semibold mb-4">{error}</p>
          <Button onClick={() => router.back()} variant="primary">
            Volver atrás
          </Button>
        </div>
      </div>
    );
  }

  /* -----------------------------------------------------------
     MAIN UI
  ----------------------------------------------------------- */

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50 pt-24">

      {/* -----------------------------------------------------
           HEADER
      ----------------------------------------------------- */}
      <div className="w-full  mb-8">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center gap-6">

            {/* Avatar */}
            <UserAvatar
              photo={(userData as any)?.photo || undefined}
              username={userData?.username || "Usuario"}
            />

            {/* Names + Info */}
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                {userData?.username || sellerData?.nombreTienda || "Mi Perfil"}
              </h1>

              <p className="text-sm text-gray-600 mt-1">
                {isSeller ? "Cuenta de Vendedor • NeoCommerce" : "Cuenta de Cliente • NeoCommerce"}
              </p>

              <div className="mt-3 flex items-center gap-4 text-sm text-gray-600">
                {userData?.email && (
                  <span className="flex items-center gap-2">
                    <IconMail size={16} className="text-red-600" />
                    {userData.email}
                  </span>
                )}

                {userData?.cellphone && (
                  <span className="flex items-center gap-2">
                    <IconPhone size={16} className="text-blue-600" />
                    {userData.cellphone}
                  </span>
                )}
              </div>
            </div>

            <div className="flex-1" />

            {/* Verified + Edit Button */}
            <div className="flex flex-col items-start gap-3">
              {isSeller && sellerData?.verificado && (
                <div className="flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                  <IconShield size={16} /> Verificado
                </div>
              )}

              <Button onClick={() => setEditPersonal(true)} variant="primary">
                Editar Perfil
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* -----------------------------------------------------
           GRID LAYOUT (3 Columns)
      ----------------------------------------------------- */}
      <section className="max-w-7xl mx-auto px-6 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* -----------------------------------------------------
               LEFT COLUMN: Personal & Contact
          ----------------------------------------------------- */}
          <div className="lg:col-span-4 space-y-6">

            {/* Personal Info */}
            <Card>
              <CardHeader>
                <h3 className="text-lg font-bold">Información personal</h3>
              </CardHeader>

              <CardContent className="flex flex-col gap-4">

                <InfoRow
                  icon={<IconId size={20} className="text-indigo-600" />}
                  label="Documento"
                  value={
                    userData?.documentType
                      ? `${userData.documentType} • ${userData.documentNumber ?? "N/A"}`
                      : "No registrado"
                  }
                  bg="bg-indigo-50"
                />

                <InfoRow
                  icon={<IconUser size={20} className="text-emerald-600" />}
                  label="Edad / Género"
                  value={
                    userData?.age
                      ? `${userData.age} años${userData?.gender ? ` • ${userData.gender}` : ""}`
                      : "No registrado"
                  }
                  bg="bg-emerald-50"
                />

                <InfoRow
                  icon={<IconWorld size={20} className="text-yellow-600" />}
                  label="Estado de cuenta"
                  value={userData?.activo ? "Activa" : "Inactiva / Verificar"}
                  bg="bg-yellow-50"
                  valueClass={userData?.activo ? "text-green-700" : "text-red-600"}
                />
              </CardContent>
            </Card>

            {/* Contact */}
            <Card>
              <CardHeader>
                <h3 className="text-lg font-bold">Contacto</h3>
              </CardHeader>

              <CardContent className="flex flex-col gap-4">

                <InfoRow
                  icon={<IconMail size={18} className="text-red-600" />}
                  label="Email"
                  value={userData?.email || "No registrado"}
                  bg="bg-red-50"
                />

                <InfoRow
                  icon={<IconPhone size={18} className="text-blue-600" />}
                  label="Celular"
                  value={userData?.cellphone || "No registrado"}
                  bg="bg-blue-50"
                />

              </CardContent>
            </Card>

          </div>

          {/* -----------------------------------------------------
               CENTER COLUMN: Orders & Summary
          ----------------------------------------------------- */}

          <div className="lg:col-span-4 space-y-6">

            {/* Orders Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

              <SummaryCard
                icon={<IconShoppingCart size={28} className="text-rose-600" />}
                title="Pedidos"
                value={ordersLoading ? "..." : ordersCount}
                subtitle={ordersLoading ? "" : `Gastado: ${moneyFmt(totalSpent)}`}
                bg="bg-rose-100"
              />

              <SummaryCard
                icon={<IconCurrencyDollar size={28} className="text-indigo-600" />}
                title="Cuenta"
                value={userData?.rol || "Cliente"}
                subtitle="Accede a descuentos y promociones"
                bg="bg-indigo-100"
              />
            </div>

            {/* Last Orders */}
            <LastOrders
              ordersLoading={ordersLoading}
              recentOrders={recentOrders}
              moneyFmt={moneyFmt}
              router={router}
            />

            {/* Full orders list */}
            <OrderList showToggleButton />

          </div>

          {/* -----------------------------------------------------
               RIGHT COLUMN: Seller Info & Products
          ----------------------------------------------------- */}

          <div className="lg:col-span-4 space-y-6">

            {isSeller && sellerData ? (
              <>
                {/* Seller Info */}
                <SellerInfoCard
                  sellerData={sellerData}
                  router={router}
                />

                {/* Products */}
                <Card>
                  <CardHeader>
                    <h3 className="text-lg font-bold flex items-center gap-2">
                      <IconPackage size={20} className="text-red-600" />
                      Mis Productos
                    </h3>
                  </CardHeader>
                  <CardContent>
                    <SellerProducts allowAdd={false} />
                  </CardContent>
                </Card>
              </>
            ) : (
              <NotASellerCard router={router} />
            )}

          </div>
        </div>
      </section>

      {/* -----------------------------------------------------
           EDIT MODAL
      ----------------------------------------------------- */}
      {editPersonal && (
        <ProfileForm
          userData={userData}
          sellerData={sellerData}
          isSeller={isSeller}
          onSave={handleSaveProfile}
          onCancel={() => setEditPersonal(false)}
          saving={saving}
          error={formError}
        />
      )}
    </main>
  );
}

/* -----------------------------------------------------------
   SMALL COMPONENTS
----------------------------------------------------------- */

function InfoRow({ icon, label, value, bg, valueClass = "" }: any) {
  return (
    <div className="flex items-center gap-3">
      <div className={`p-2 rounded-md ${bg}`}>{icon}</div>
      <div>
        <p className="text-xs text-black">{label}</p>
        <p className={`font-semibold text-gray-900 ${valueClass}`}>{value}</p>
      </div>
    </div>
  );
}

function SummaryCard({ icon, title, value, subtitle, bg }: any) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4">
        <div className={`p-3 rounded-lg ${bg}`}>{icon}</div>

        <div>
          <p className="text-xs text-black uppercase">{title}</p>
          <p className="text-xl font-bold">{value}</p>
          {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
        </div>
      </CardContent>
    </Card>
  );
}

function LastOrders({ ordersLoading, recentOrders, moneyFmt, router }: any) {
  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-semibold text-gray-900">Últimos pedidos</h3>
      </CardHeader>

      <CardContent>
        {ordersLoading ? (
          <p className="text-gray-600">Cargando pedidos...</p>
        ) : recentOrders.length === 0 ? (
          <p className="text-gray-600">Aún no tienes pedidos.</p>
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentOrders.map((o: any) => {
              const dateStr = o?.fecha
                ? new Date(o.fecha).toLocaleDateString("es-ES", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })
                : "—";

              const itemsCount = Array.isArray(o.items)
                ? o.items.length
                : o.itemCount ?? 0;

              return (
                <li
                  key={o.id}
                  className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 flex flex-col justify-between min-h-[150px]"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs text-gray-500">Pedido</p>
                      <p className="text-sm font-semibold text-gray-900">#{o.id}</p>
                      <p className="mt-1 text-xs text-gray-600">{dateStr}</p>
                    </div>

                    <div className="text-right">
                      <p className="text-xs text-gray-500">Total</p>
                      <p className="text-xl font-extrabold text-gray-900 leading-tight">
                        {moneyFmt(Number(o.total ?? 0))}
                      </p>
                    </div>
                  </div>

                  {/* Estado + Ítems */}
                  <div className="mt-4 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded-full">
                        {itemsCount} ítems
                      </span>

                      {o.estado && (
                        <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full">
                          {String(o.estado)}
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => router.push(`/user/historial/${o.id}`)}
                      className="text-red-600 font-medium hover:underline"
                    >
                      Ver detalle
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}

function SellerInfoCard({ sellerData, router }: any) {
  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-bold flex items-center gap-2">
          <IconBriefcase size={20} className="text-amber-600" />
          Mi Tienda
        </h3>
      </CardHeader>

      <CardContent className="flex flex-col gap-4">

        <InfoRow
          icon={<IconBriefcase size={20} className="text-amber-600" />}
          label="Nombre de la tienda"
          value={sellerData.nombreTienda || "No registrada"}
          bg="bg-amber-50"
        />

        <InfoRow
          icon={<IconMapPin size={20} className="text-rose-600" />}
          label="Dirección"
          value={sellerData.direccion || "No registrada"}
          bg="bg-rose-50"
        />

        <InfoRow
          icon={<IconId size={20} className="text-indigo-600" />}
          label="NIT / RFC"
          value={sellerData.nitORfc || "No registrado"}
          bg="bg-indigo-50"
        />

        <InfoRow
          icon={<IconPhone size={20} className="text-blue-600" />}
          label="Teléfono"
          value={sellerData.telefono || "No registrado"}
          bg="bg-blue-50"
        />

        <InfoRow
          icon={<IconWorld size={20} className="text-cyan-600" />}
          label="Ciudad"
          value={sellerData.ciudad || "No registrada"}
          bg="bg-cyan-50"
        />

        <InfoRow
          icon={<IconWorld size={20} className="text-green-600" />}
          label="País"
          value={sellerData.pais || "No registrado"}
          bg="bg-green-50"
        />

      </CardContent>
    </Card>
  );
}

function NotASellerCard({ router }: any) {
  return (
    <Card className="text-center py-10 flex justify-center">
      <CardContent>
        <IconBriefcase size={40} className="text-gray-300 mx-auto mb-3" />
        <p className="text-gray-700 font-semibold">Eres cliente</p>
        <p className="text-sm text-gray-500 mt-1">Únete como vendedor para gestionar tu tienda</p>

        <Button
          onClick={() => router.push("/user/vendedor")}
          variant="primary"
          size="sm"
          className="mt-4"
        >
          Ser vendedor
        </Button>
      </CardContent>
    </Card>
  );
}
