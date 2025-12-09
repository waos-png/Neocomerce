/**
 * Componente SellerLoginDialog
 * Formulario de inicio de sesión para vendedores.
 * Permite ingresar email y contraseña y autentica contra la API.
 */

import * as React from 'react';
import {
  IconMail,
  IconLock,
  IconLogin,
  IconUserPlus,
} from '@tabler/icons-react';
import Swal from "sweetalert2";

interface SellerLoginDialogProps {
  onSwitchToRegister?: () => void;
  onLoginSuccess?: () => void;
}

const SellerLoginDialog: React.FC<SellerLoginDialogProps> = ({ onSwitchToRegister, onLoginSuccess }) => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch('https://suspicious-canid-dysai-ecommerce-b06e7d5a.koyeb.app/login/seller/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        Swal.fire({
          icon: "error",
          title: "Error",
          text: errorData.detail || 'Email o contraseña incorrectos',
          background: "#fff5f5",
          color: "#C73838",
          iconColor: "#C73838",
        });
        return;
      }

      const data = await response.json();
      // Guardar token y seller (ya existente)
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('seller', JSON.stringify(data.seller));
      // Notificar a la UI que hubo login (para que Navbar muestre "Vender")
      try {
        window.dispatchEvent(new Event('userLogin'));
      } catch {
        // no bloquear si falla en entornos extraños
      }

      Swal.fire({
        icon: "success",
        title: "¡Bienvenido vendedor!",
        text: "Has iniciado sesión correctamente",
        showConfirmButton: false,
        timer: 1500,
        background: "#fff5f5",
        color: "#C73838",
        iconColor: "#C73838",
      });

      if (onLoginSuccess) {
        onLoginSuccess();
      }

      setEmail('');
      setPassword('');
    } catch (err: any) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Error al iniciar sesión: " + err.message,
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
          <IconLogin size={36} className="text-white" />
        </div>
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-[#C73838] tracking-tight">
            Panel de vendedor
          </h2>
          <p className="text-sm text-gray-500 mt-2">
            Accede a tu panel de ventas y gestiona tus productos
          </p>
        </div>
      </div>

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
          placeholder="Tu contraseña"
        />
      </label>

      {/* Botón de login */}
      <button
        type="submit"
        className="w-full bg-gradient-to-r from-[#C73838] via-[#B11212] to-orange-500 hover:from-[#B11212] hover:via-[#8f0e0e] hover:to-orange-600 text-white font-bold py-3 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 mt-8 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2"
        style={{
          boxShadow: '0 6px 24px 0 rgba(199, 56, 56, 0.15)'
        }}
      >
        <span>Acceder al panel</span>
        <IconLogin className="text-white" size={20} />
      </button>

      {/* Divider */}
      <div className="flex items-center gap-3 my-4">
        <div className="flex-1 h-px bg-red-100"></div>
        <span className="text-xs text-gray-400">o</span>
        <div className="flex-1 h-px bg-red-100"></div>
      </div>

      {/* Link a registro */}
      <div className="text-center space-y-2">
        <p className="text-sm text-gray-600">
          ¿No tienes cuenta de vendedor?
        </p>
        <button
          type="button"
          onClick={onSwitchToRegister}
          className="inline-flex items-center gap-2 text-[#C73838] hover:text-[#B11212] font-semibold transition-colors hover:underline"
        >
          <IconUserPlus size={16} />
          Regístrate como vendedor
        </button>
      </div>
    </form>
  );
};

export default SellerLoginDialog;
