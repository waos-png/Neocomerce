/**
 * Componente SellerRegisterDialog
 * Formulario de registro para vendedores.
 * Permite a un vendedor registrarse y crear su cuenta.
 */

import * as React from 'react';
import {
  IconMail,
  IconLock,
  IconUser,
  IconPhone,
  IconUserPlus,
  IconLogin,
  IconBriefcase,
} from '@tabler/icons-react';
import Swal from "sweetalert2";

interface SellerRegisterDialogProps {
  onSwitchToLogin?: () => void;
}

const SellerRegisterDialog: React.FC<SellerRegisterDialogProps> = ({ onSwitchToLogin }) => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [businessName, setBusinessName] = React.useState('');
  const [phoneNumber, setPhoneNumber] = React.useState('');
  const [ownerName, setOwnerName] = React.useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Las contraseñas no coinciden",
        background: "#fff5f5",
        color: "#C73838",
        iconColor: "#C73838",
      });
      return;
    }
    try {
      const response = await fetch('https://suspicious-canid-dysai-ecommerce-b06e7d5a.koyeb.app/register/seller/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          business_name: businessName,
          owner_name: ownerName,
          cellphone: phoneNumber,
        }),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        if (errorData.detail) {
          alert('Error: ' + errorData.detail);
        } else {
          alert('Error en el registro');
        }
        return;
      }
      Swal.fire({
        icon: "success",
        title: "¡Registro exitoso!",
        text: "Tu cuenta de vendedor ha sido creada correctamente",
        showConfirmButton: false,
        timer: 1800,
        background: "#fff5f5",
        color: "#C73838",
        iconColor: "#C73838",
      });
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setBusinessName('');
      setPhoneNumber('');
      setOwnerName('');
    } catch (err: any) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Error al registrar vendedor: " + err.message,
        background: "#fff5f5",
        color: "#C73838",
        iconColor: "#C73838",
      });
    }
  };

  return (
    <form
      className="w-full space-y-6"
      onSubmit={handleSubmit}
      autoComplete="on"
    >
      {/* Encabezado */}
      <div className="flex flex-col items-center gap-3 mb-6">
        <div className="bg-gradient-to-br from-[#C73838] to-[#B11212] rounded-full p-4 shadow-lg">
          <IconBriefcase size={36} className="text-white" />
        </div>
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-[#C73838] tracking-tight">
            Cuenta de vendedor
          </h2>
          <p className="text-sm text-gray-500 mt-2">
            Crea tu cuenta y comienza a vender
          </p>
        </div>
      </div>

      {/* Nombre del negocio */}
      <label className="flex flex-col text-sm font-medium text-gray-700 gap-2">
        <span className="flex items-center gap-2">
          <IconBriefcase size={18} className="text-[#C73838]" />
          Nombre del negocio
        </span>
        <input
          type="text"
          required
          value={businessName}
          onChange={(e) => setBusinessName(e.target.value)}
          className="px-4 py-2.5 border border-red-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C73838] focus:border-transparent transition bg-red-50/50 hover:bg-red-50"
          placeholder="Tu nombre de negocio"
        />
      </label>

      {/* Nombre del propietario */}
      <label className="flex flex-col text-sm font-medium text-gray-700 gap-2">
        <span className="flex items-center gap-2">
          <IconUser size={18} className="text-[#C73838]" />
          Nombre del propietario
        </span>
        <input
          type="text"
          required
          value={ownerName}
          onChange={(e) => setOwnerName(e.target.value)}
          className="px-4 py-2.5 border border-red-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C73838] focus:border-transparent transition bg-red-50/50 hover:bg-red-50"
          placeholder="Tu nombre completo"
        />
      </label>

      {/* Email */}
      <label className="flex flex-col text-sm font-medium text-gray-700 gap-2">
        <span className="flex items-center gap-2">
          <IconMail size={18} className="text-[#C73838]" />
          Email
        </span>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="px-4 py-2.5 border border-red-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C73838] focus:border-transparent transition bg-red-50/50 hover:bg-red-50"
          placeholder="tucorreo@email.com"
        />
      </label>

      {/* Teléfono */}
      <label className="flex flex-col text-sm font-medium text-gray-700 gap-2">
        <span className="flex items-center gap-2">
          <IconPhone size={18} className="text-[#C73838]" />
          Teléfono
        </span>
        <input
          type="tel"
          required
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          className="px-4 py-2.5 border border-red-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C73838] focus:border-transparent transition bg-red-50/50 hover:bg-red-50"
          placeholder="3001234567"
        />
      </label>

      {/* Contraseña */}
      <label className="flex flex-col text-sm font-medium text-gray-700 gap-2">
        <span className="flex items-center gap-2">
          <IconLock size={18} className="text-[#C73838]" />
          Contraseña
        </span>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="px-4 py-2.5 border border-red-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C73838] focus:border-transparent transition bg-red-50/50 hover:bg-red-50"
          placeholder="Mínimo 8 caracteres"
        />
      </label>

      {/* Confirmar Contraseña */}
      <label className="flex flex-col text-sm font-medium text-gray-700 gap-2">
        <span className="flex items-center gap-2">
          <IconLock size={18} className="text-[#C73838]" />
          Confirmar contraseña
        </span>
        <input
          type="password"
          required
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="px-4 py-2.5 border border-red-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C73838] focus:border-transparent transition bg-red-50/50 hover:bg-red-50"
          placeholder="Repite tu contraseña"
        />
      </label>

      {/* Botón de registro */}
      <button
        type="submit"
        className="w-full bg-gradient-to-r from-[#C73838] via-[#B11212] to-orange-500 hover:from-[#B11212] hover:via-[#8f0e0e] hover:to-orange-600 text-white font-bold py-3 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 mt-8 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2"
        style={{
          boxShadow: '0 6px 24px 0 rgba(199, 56, 56, 0.15)'
        }}
      >
        <span>Crear cuenta de vendedor</span>
        <IconUserPlus className="text-white" size={20} />
      </button>

      {/* Divider */}
      <div className="flex items-center gap-3 my-4">
        <div className="flex-1 h-px bg-red-100"></div>
        <span className="text-xs text-gray-400">o</span>
        <div className="flex-1 h-px bg-red-100"></div>
      </div>

      {/* Link a login */}
      <div className="text-center space-y-2">
        <p className="text-sm text-gray-600">
          ¿Ya tienes cuenta?
        </p>
        <button
          type="button"
          onClick={onSwitchToLogin}
          className="inline-flex items-center gap-2 text-[#C73838] hover:text-[#B11212] font-semibold transition-colors hover:underline"
        >
          <IconLogin size={16} />
          Inicia sesión aquí
        </button>
      </div>
    </form>
  );
};

export default SellerRegisterDialog;
