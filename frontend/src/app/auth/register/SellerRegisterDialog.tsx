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
  IconEye,
  IconEyeOff,
  IconId,  
} from '@tabler/icons-react';
import Swal from "sweetalert2";
import { API_BASE } from '@/lib/apiBase';

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
  const [documentType, setDocumentType] = React.useState('cédula de ciudadanía');
  const [documentNumber, setDocumentNumber] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  const [passwordValidation, setPasswordValidation] = React.useState({
    hasMinLength: false,
    hasUppercase: false,
    hasLowercase: false,
    hasNumber: false,
    hasSpecialChar: false,
  });

  const [passwordsMatch, setPasswordsMatch] = React.useState(false);

  React.useEffect(() => {
    if (password) {
      setPasswordValidation({
        hasMinLength: password.length >= 8,
        hasUppercase: /[A-Z]/.test(password),
        hasLowercase: /[a-z]/.test(password),
        hasNumber: /\d/.test(password),
        hasSpecialChar: /[@$!%*?&]/.test(password),
      });
    } else {
      setPasswordValidation({
        hasMinLength: false,
        hasUppercase: false,
        hasLowercase: false,
        hasNumber: false,
        hasSpecialChar: false,
      });
    }
  }, [password]);

  React.useEffect(() => {
    if (confirmPassword && password) {
      setPasswordsMatch(password === confirmPassword);
    } else {
      setPasswordsMatch(false);
    }
  }, [password, confirmPassword]);

  const passwordIsValid = passwordValidation.hasMinLength && passwordValidation.hasUppercase && 
    passwordValidation.hasLowercase && passwordValidation.hasNumber && passwordValidation.hasSpecialChar;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validar campos obligatorios
    if (!documentNumber || !documentNumber.trim()) {
      Swal.fire({
        icon: "error",
        title: "Documento requerido",
        text: "Por favor ingresa tu número de documento",
        background: "#fff5f5",
        color: "#C73838",
        iconColor: "#C73838",
      });
      return;
    }

    if (!businessName || !businessName.trim()) {
      Swal.fire({
        icon: "error",
        title: "Negocio requerido",
        text: "Por favor ingresa el nombre de tu negocio",
        background: "#fff5f5",
        color: "#C73838",
        iconColor: "#C73838",
      });
      return;
    }

    if (!ownerName || !ownerName.trim()) {
      Swal.fire({
        icon: "error",
        title: "Propietario requerido",
        text: "Por favor ingresa tu nombre completo",
        background: "#fff5f5",
        color: "#C73838",
        iconColor: "#C73838",
      });
      return;
    }

    if (!email || !email.trim()) {
      Swal.fire({
        icon: "error",
        title: "Email requerido",
        text: "Por favor ingresa tu email",
        background: "#fff5f5",
        color: "#C73838",
        iconColor: "#C73838",
      });
      return;
    }

    if (!phoneNumber || !phoneNumber.trim()) {
      Swal.fire({
        icon: "error",
        title: "Teléfono requerido",
        text: "Por favor ingresa tu número de teléfono",
        background: "#fff5f5",
        color: "#C73838",
        iconColor: "#C73838",
      });
      return;
    }

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

    if (!passwordIsValid) {
      Swal.fire({
        icon: "error",
        title: "Contraseña débil",
        text: "La contraseña no cumple con los requisitos",
        background: "#fff5f5",
        color: "#C73838",
        iconColor: "#C73838",
      });
      return;
    }

    try {
      const payload = {
        documentNumber: Number(documentNumber),
        documentType:
          documentType === 'cédula de ciudadanía' ? 'CC'
          : documentType === 'tarjeta de identidad' ? 'TI'
          : documentType === 'pasaporte' ? 'PAS'
          : 'DNI',
        username: ownerName || businessName || email,
        cellphone: phoneNumber,
        email,
        password,
        gender: null,
        age: null,
        rol: 'VENDEDOR'
      };

      const response = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const msg = errorData.detail || JSON.stringify(errorData) || 'Error en el registro';
        Swal.fire({ icon: 'error', title: 'Error', text: msg });
        return;
      }

      const data = await response.json();
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify({ id: data.id, email: data.email, username: data.username, rol: data.rol }));

      Swal.fire({ icon: 'success', title: '¡Registro vendedor exitoso!', showConfirmButton: false, timer: 1600 });
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setBusinessName('');
      setPhoneNumber('');
      setOwnerName('');
      setDocumentNumber('');
      setDocumentType('cédula de ciudadanía');
    } catch (err: any) {
      Swal.fire({ icon: 'error', title: 'Error', text: 'Error al registrar vendedor: ' + (err?.message || err) });
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

      {/* Tipo de Documento */}
      <label className="flex flex-col text-sm font-medium text-gray-700 gap-2">
        <span className="flex items-center gap-2">
          <IconUser size={18} className="text-[#C73838]" />
          Tipo de Documento
        </span>
        <select
          value={documentType}
          onChange={(e) => setDocumentType(e.target.value)}
          className="px-4 py-2.5 border border-red-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C73838] focus:border-transparent transition bg-red-50/50 hover:bg-red-50"
        >
          <option value="cédula de ciudadanía">Cédula de Ciudadanía</option>
          <option value="tarjeta de identidad">Tarjeta de Identidad</option>
          <option value="pasaporte">Pasaporte</option>
          <option value="DNI">DNI</option>
        </select>
      </label>

      {/* Número de Documento */}
      <label className="flex flex-col text-sm font-medium text-gray-700 gap-2">
        <span className="flex items-center gap-2">
          <IconId size={18} className="text-[#C73838]" />
          Número de Documento
        </span>
        <input
          type="text"
          required
          value={documentNumber}
          onChange={(e) => setDocumentNumber(e.target.value)}
          className="px-4 py-2.5 border border-red-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C73838] focus:border-transparent transition bg-red-50/50 hover:bg-red-50"
          placeholder="12345678"
        />
      </label>

      {/* Contraseña */}
      <label className="flex flex-col text-sm font-medium text-gray-700 gap-2">
        <span className="flex items-center gap-2">
          <IconLock size={18} className="text-[#C73838]" />
          Contraseña
        </span>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2.5 border border-red-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C73838] focus:border-transparent transition bg-red-50/50 hover:bg-red-50"
            placeholder="Mínimo 8 caracteres"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#C73838] transition"
            aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
          >
            {showPassword ? (
              <IconEyeOff size={20} />
            ) : (
              <IconEye size={20} />
            )}
          </button>
        </div>
        {/* Requisitos de contraseña - Solo caja */}
          {password && (
            <div className="mt-2 p-3 bg-green-50 rounded-lg border border-green-200 space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center gap-2 text-xs">
                  <span className={passwordValidation.hasMinLength ? "text-green-600 font-bold" : "text-gray-400"}>
                    {passwordValidation.hasMinLength ? "✓" : "○"}
                  </span>
                  <span className={passwordValidation.hasMinLength ? "text-green-700 font-medium" : "text-gray-500"}>
                    Mínimo 8 caracteres
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className={passwordValidation.hasUppercase ? "text-green-600 font-bold" : "text-gray-400"}>
                    {passwordValidation.hasUppercase ? "✓" : "○"}
                  </span>
                  <span className={passwordValidation.hasUppercase ? "text-green-700 font-medium" : "text-gray-500"}>
                    Al menos una letra mayúscula
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className={passwordValidation.hasLowercase ? "text-green-600 font-bold" : "text-gray-400"}>
                    {passwordValidation.hasLowercase ? "✓" : "○"}
                  </span>
                  <span className={passwordValidation.hasLowercase ? "text-green-700 font-medium" : "text-gray-500"}>
                    Al menos una letra minúscula
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className={passwordValidation.hasNumber ? "text-green-600 font-bold" : "text-gray-400"}>
                    {passwordValidation.hasNumber ? "✓" : "○"}
                  </span>
                  <span className={passwordValidation.hasNumber ? "text-green-700 font-medium" : "text-gray-500"}>
                    Al menos un número
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs col-span-2">
                  <span className={passwordValidation.hasSpecialChar ? "text-green-600 font-bold" : "text-gray-400"}>
                    {passwordValidation.hasSpecialChar ? "✓" : "○"}
                  </span>
                  <span className={passwordValidation.hasSpecialChar ? "text-green-700 font-medium" : "text-gray-500"}>
                    Carácter especial (@$!%*?&)
                  </span>
                </div>
              </div>
            </div>
          )}
      </label>

      {/* Confirmar Contraseña */}
      <label className="flex flex-col text-sm font-medium text-gray-700 gap-2">
        <span className="flex items-center gap-2">
          <IconLock size={18} className="text-[#C73838]" />
          Confirmar contraseña
        </span>
        <div className="relative">
          <input
            type={showConfirmPassword ? "text" : "password"}
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-4 py-2.5 border border-red-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C73838] focus:border-transparent transition bg-red-50/50 hover:bg-red-50"
            placeholder="Repite tu contraseña"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#C73838] transition"
            aria-label={showConfirmPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
          >
            {showConfirmPassword ? (
              <IconEyeOff size={20} />
            ) : (
              <IconEye size={20} />
            )}
          </button>
        </div>
      </label>

      {/* Botón de registro */}
      <button
        type="submit"
        className="w-full bg-gradient-to-r from-[#C73838] via-[#B11212] to-orange-500 hover:from-[#B11212] hover:via-[#8f0e0e] hover:to-orange-600 text-white font-bold py-3 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 mt-8 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2"
        style={{
          boxShadow: '0 6px 24px 0 rgba(199, 56, 56, 0.15)'
        }}
        disabled={!passwordIsValid}
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
