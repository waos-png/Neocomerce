/**
 * Componente LoginDialog
 * Formulario de inicio de sesión para usuarios.
 * Permite ingresar email y contraseña y autentica contra la API.
 */

import * as React from 'react';
import Cookies from 'js-cookie';
import { IconMail, IconLock, IconEye, IconEyeOff, IconLogin } from '@tabler/icons-react';
import Swal from "sweetalert2";

// ===============================
// Componente de login de usuario
// Permite a un usuario iniciar sesión y autentica contra el backend
// ===============================
const LoginDialog: React.FC<{ onLoginSuccess?: () => void }> = ({ onLoginSuccess }) => {
  // Estados locales para almacenar el email y la contraseña ingresados
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);

  // Maneja el envío del formulario de login
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch('https://suspicious-canid-dysai-ecommerce-b06e7d5a.koyeb.app/login/user/', {
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
        if (errorData.detail) {
          alert('Error: ' + errorData.detail);
        } else if (typeof errorData === 'object') {
          const firstKey = Object.keys(errorData)[0];
          if (firstKey && Array.isArray(errorData[firstKey])) {
            alert(`${firstKey}: ${errorData[firstKey].join(' ')}`);
          } else {
            alert('Error en el inicio de sesión');
          }
        } else {
          alert('Error en el inicio de sesión');
        }
        return;
      }
      const data = await response.json();
      if (data.token) {
        Cookies.set('token', data.token, { expires: 7, path: '/' }); // cookie expires in 7 days
        localStorage.setItem('token', data.token);
      }
      if (data.user) {
        Cookies.set('user', JSON.stringify(data.user), { expires: 7, path: '/' });
        localStorage.setItem('user', JSON.stringify(data.user));
      }
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('userLogin'));
      }
      Swal.fire({
        icon: "success",
        title: "¡Inicio de sesión exitoso!",
        showConfirmButton: false,
        timer: 1800,
        background: "#fff0fa",
        color: "#a21caf",
        iconColor: "#a21caf",
      });
      if (onLoginSuccess) {
        onLoginSuccess();
      }
      // Aquí podrías cerrar el modal, redirigir, etc.
    } catch (err: any) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Error al iniciar sesión: " + err.message,
        background: "#fff0fa",
        color: "#a21caf",
        iconColor: "#a21caf",
      });
    }
  };

  return (
    <form
      className="flex flex-col gap-6 p-8 w-full bg-white rounded-2xl shadow-2xl max-w-sm mx-auto border border-fuchsia-100"
      onSubmit={handleSubmit}
      autoComplete="on"
    >
      {/* Encabezado */}
      <div className="flex flex-col items-center gap-2 mb-2">
        <span className="bg-fuchsia-600 rounded-full p-3 shadow-lg mb-1">
          <IconLogin size={32} className="text-white" />
        </span>
        <h2 className="text-2xl font-extrabold text-center text-fuchsia-700 tracking-wide">
          Iniciar sesión
        </h2>
      </div>

      {/* Campo para ingresar el email */}
      <label className="flex flex-col text-sm font-semibold text-gray-700 gap-1 relative">
        <span className="flex items-center gap-2">
          <IconMail size={18} className="text-fuchsia-500" />
          Email
        </span>
        <input
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 p-2 pl-10 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500 transition placeholder-gray-400"
          placeholder="tucorreo@email.com"
          style={{ backgroundImage: 'none' }}
        />
      </label>

      {/* Campo para ingresar la contraseña */}
      <label className="flex flex-col text-sm font-semibold text-gray-700 gap-1 relative">
        <span className="flex items-center gap-2">
          <IconLock size={18} className="text-fuchsia-500" />
          Contraseña
        </span>
        <input
          type={showPassword ? "text" : "password"}
          required
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 p-2 pl-10 pr-10 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500 transition placeholder-gray-400"
          placeholder="Tu contraseña"
        />
        <button
          type="button"
          tabIndex={-1}
          className="absolute right-3 top-9 text-fuchsia-400 hover:text-fuchsia-600 transition-colors"
          onClick={() => setShowPassword((v) => !v)}
          aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
        >
          {showPassword ? (
            <IconEyeOff size={20} />
          ) : (
            <IconEye size={20} />
          )}
        </button>
      </label>

      {/* Botón para enviar el formulario */}
      <button
        type="submit"
        className="mt-2 w-full bg-fuchsia-600 text-white font-bold py-2 rounded-lg shadow-xl hover:bg-fuchsia-700 hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 text-base focus:outline-none focus:ring-2 focus:ring-fuchsia-400"
        style={{
          boxShadow: '0 6px 24px 0 rgba(168, 85, 247, 0.13), 0 2px 8px 0 rgba(168, 85, 247, 0.13)'
        }}
      >
        <span>Entrar</span>
        <IconLogin size={20} className="text-white" />
      </button>
    </form>
  );
};

export default LoginDialog;
