"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { UserAvatar } from "../components/UserAvatar";
import { ProfileForm } from "./components/ProfileForm";
import { SellerProducts } from "./components/SellerProducts";
import { OrderList } from "../historial/components/OrderList";
import { useProfileData } from "../hooks/useProfileData";
import AuthDialog from "../../auth/AuthDialog";
import { UserData, SellerData } from "../types/user";
import { IconLoader2 } from "@tabler/icons-react";

export default function ProfilePage() {
  const router = useRouter();
  const { userData, loading, error, isSeller, updateProfile, refetch } = useProfileData();
  const [editPersonal, setEditPersonal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showAuthDialog, setShowAuthDialog] = useState(!userData && !loading);

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

  const handleSaveProfile = async (data: UserData | SellerData) => {
    setSaving(true);
    try {
      await updateProfile(data);
      setEditPersonal(false);
    } finally {
      setSaving(false);
    }
  };

  // Loading state
  if (loading && !userData) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50">
        <div className="text-center">
          <IconLoader2 size={48} className="text-red-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-semibold">Cargando perfil...</p>
        </div>
      </div>
    );
  }

  // Auth Dialog
  if (showAuthDialog) {
    return <AuthDialog open={showAuthDialog} onOpenChange={handleAuthDialogClose} showBackButton />;
  }

  // Error state
  if (error && !userData) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50">
        <div className="text-center max-w-md">
          <div className="text-red-600 text-6xl mb-4">⚠️</div>
          <p className="text-red-700 font-semibold mb-4">{error}</p>
          <button
            onClick={() => router.back()}
            className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold"
          >
            Volver atrás
          </button>
        </div>
      </div>
    );
  }

  return (
    <section className="flex justify-center w-full min-h-screen bg-gradient-to-br from-red-50 to-orange-50 pt-24 pb-10 px-2">
      <div className="flex flex-col gap-10 w-full max-w-5xl">
        {/* Profile Header Card */}
        <Card className="flex flex-col md:flex-row items-center md:items-start gap-8 p-8 shadow-xl border-0 bg-white/80 backdrop-blur rounded-2xl">
          <UserAvatar
            photo={userData?.photo}
            username={(userData as any)?.username || (userData as any)?.seller_name}
          />
          <div className="flex-1 flex flex-col gap-4">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg font-semibold text-red-700">
                  {isSeller ? "Vendedor" : "Usuario"}
                </span>
                {isSeller && (
                  <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold">
                    Seller
                  </span>
                )}
              </div>
              <div className="text-gray-600 text-sm mb-1">{userData?.email}</div>
              <div className="text-gray-500 text-xs">Celular: {userData?.cellphone || "No registrado"}</div>
            </div>
            <div className="flex gap-4 flex-wrap">
              <Button
                onClick={() => setEditPersonal(true)}
                className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold px-6 py-2 rounded-lg shadow transition-all"
              >
                Editar perfil
              </Button>
              <Button
                className="border-2 border-red-300 text-red-700 hover:bg-red-50 font-semibold px-6 py-2 rounded-lg shadow bg-white"
                onClick={refetch}
              >
                Refrescar
              </Button>
            </div>
          </div>
        </Card>

        {/* Edit Form Modal */}
        {editPersonal && userData && (
          <ProfileForm
            userData={userData}
            isSeller={isSeller}
            onSave={handleSaveProfile}
            onCancel={() => setEditPersonal(false)}
            saving={saving}
            error={error}
          />
        )}

        {/* Order History Card */}
        <Card className="p-6 shadow-lg border-0 bg-white/80 backdrop-blur rounded-2xl">
          <OrderList showToggleButton={true} />
        </Card>

        {/* Seller Product Management */}
        {isSeller && (
          <Card className="p-6 shadow-lg border-0 bg-white/80 backdrop-blur rounded-2xl space-y-4">
            <h2 className="text-2xl font-bold text-red-700">Gestión de Productos</h2>
            <SellerProducts />
          </Card>
        )}
      </div>
    </section>
  );
}

