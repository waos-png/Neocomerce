import { useState, useEffect } from "react";
import { UserData, SellerData } from "../types/user";
import * as userApi from "../lib/userApi";

export function useProfileData() {
  const [userData, setUserData] = useState<UserData | SellerData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSeller, setIsSeller] = useState(false);

  useEffect(() => {
    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await userApi.fetchProfile();
      setUserData(data);
      setIsSeller(!!localStorage.getItem("sellerToken"));
    } catch (err: any) {
      setError(err.message || "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updatedData: UserData | SellerData) => {
    setLoading(true);
    setError(null);
    try {
      await userApi.updateProfile(updatedData);
      setUserData(updatedData);
    } catch (err: any) {
      setError(err.message || "No se pudo actualizar el perfil");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { userData, loading, error, isSeller, updateProfile, refetch: fetchProfile };
}