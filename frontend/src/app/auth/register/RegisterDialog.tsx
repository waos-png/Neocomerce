/**
 * Componente RegisterDialog
 * Formulario de registro de usuario.
 * Permite a un usuario registrarse llenando el formulario y enviando los datos al backend.
 */

import * as React from 'react';
import {
  IconMail,
  IconLock,
  IconUser,
  IconId,
  IconPhone,
  IconUserCircle,
  IconGenderMale,
  IconGenderFemale,
  IconUserPlus,
  IconLogin,
  IconEye,
  IconEyeOff,
} from '@tabler/icons-react';
import Swal from "sweetalert2";
import { API_BASE } from '@/lib/apiBase';

interface RegisterDialogProps {
  onSwitchToLogin?: () => void;
}

const RegisterDialog: React.FC<RegisterDialogProps> = ({ onSwitchToLogin }) => {
  // Estados locales para almacenar los valores de los campos
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [documentType, setDocumentType] = React.useState('cédula de ciudadanía');
  const [documentNumber, setDocumentNumber] = React.useState('');
  const [phoneNumber, setPhoneNumber] = React.useState('');
  const [username, setUsername] = React.useState('');
  const [gender, setGender] = React.useState('');
  const [age, setAge] = React.useState('');
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

  // Maneja el envío del formulario de registro de usuario
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
        documentNumber: documentNumber ? Number(documentNumber) : null,
        documentType:
          documentType === 'cédula de ciudadanía' ? 'CC'
          : documentType === 'tarjeta de identidad' ? 'TI'
          : 'PAS',
        username,
        cellphone: phoneNumber,
        email,
        password,
        gender: gender === 'masculino' ? 'M' : gender === 'femenino' ? 'F' : 'OTRO',
        age: age ? Number(age) : null,
        rol: 'CLIENTE'
      };

      const response = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const msg = errorData.detail || errorData.message || JSON.stringify(errorData) || 'Error en el registro';
        Swal.fire({ icon: 'error', title: 'Error', text: msg });
        return;
      }

      const data = await response.json();
      // El backend devuelve AuthResponse { id, email, username, rol, token }
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify({ id: data.id, email: data.email, username: data.username, rol: data.rol }));

      Swal.fire({ icon: 'success', title: '¡Registro exitoso!', showConfirmButton: false, timer: 1600 });
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setDocumentType('cédula de ciudadanía');
      setPhoneNumber('');
      setDocumentNumber('');
      setUsername('');
      setGender('');
      setAge('');
    } catch (err: any) {
      Swal.fire({ icon: 'error', title: 'Error', text: 'Error al registrar usuario: ' + (err?.message || err) });
    }
  };

  return (
    <form
      className="w-full bg-white rounded-3xl shadow-2xl border border-red-100 p-8 space-y-6 max-w-md"
      onSubmit={handleSubmit}
      autoComplete="on"
    >
      {/* Encabezado */}
      <div className="flex flex-col items-center gap-3 mb-6">
        <div className="bg-gradient-to-br from-[#C73838] to-[#B11212] rounded-full p-4 shadow-lg">
          <IconUserPlus size={36} className="text-white" />
        </div>
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-[#C73838] tracking-tight">
            Crear cuenta
          </h2>
          <p className="text-sm text-gray-500 mt-2">
            Únete a nuestra comunidad y comienza a comprar
          </p>
        </div>
      </div>

      {/* SECCIÓN 1: Credenciales */}
      <div className="space-y-3">
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
      </div>

      {/* SECCIÓN 2: Información Personal */}
      <div className="space-y-3 pt-2">
        {/* Nombre de Usuario */}
        <label className="flex flex-col text-sm font-medium text-gray-700 gap-2">
          <span className="flex items-center gap-2">
            <IconUserCircle size={18} className="text-[#C73838]" />
            Nombre de usuario
          </span>
          <input
            type="text"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="px-4 py-2.5 border border-red-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C73838] focus:border-transparent transition bg-red-50/50 hover:bg-red-50"
            placeholder="Tu nombre de usuario"
          />
        </label>

        {/* Género y Edad - Dos columnas */}
        <div className="grid grid-cols-2 gap-3">
          {/* Género */}
          <label className="flex flex-col text-sm font-medium text-gray-700 gap-2">
            <span className="flex items-center gap-2">
              {gender === "femenino" ? (
                <IconGenderFemale size={18} className="text-[#C73838]" />
              ) : (
                <IconGenderMale size={18} className="text-[#C73838]" />
              )}
              Género
            </span>
            <select
              required
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="px-4 py-2.5 border border-red-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C73838] focus:border-transparent transition bg-red-50/50 hover:bg-red-50 text-gray-700"
            >
              <option value="">Selecciona</option>
              <option value="masculino">Masculino</option>
              <option value="femenino">Femenino</option>
            </select>
          </label>

          {/* Edad */}
          <label className="flex flex-col text-sm font-medium text-gray-700 gap-2">
            <span className="flex items-center gap-2">
              <IconUser size={18} className="text-[#C73838]" />
              Edad
            </span>
            <input
              type="number"
              min="18"
              max="120"
              required
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="px-4 py-2.5 border border-red-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C73838] focus:border-transparent transition bg-red-50/50 hover:bg-red-50"
              placeholder="18"
            />
          </label>
        </div>
      </div>

      {/* SECCIÓN 3: Identificación */}
      <div className="space-y-3 pt-2">
        {/* Tipo de Documento */}
        <label className="flex flex-col text-sm font-medium text-gray-700 gap-2">
          <span className="flex items-center gap-2">
            <IconId size={18} className="text-[#C73838]" />
            Tipo de documento
          </span>
          <select
            required
            value={documentType}
            onChange={(e) => setDocumentType(e.target.value)}
            className="px-4 py-2.5 border border-red-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C73838] focus:border-transparent transition bg-red-50/50 hover:bg-red-50 text-gray-700"
          >
            <option value="cédula de ciudadanía">Cédula de Ciudadanía</option>
            <option value="tarjeta de identidad">Tarjeta de Identidad</option>
            <option value="pasaporte">Pasaporte</option>
            <option value="DNI">DNI</option>
          </select>
        </label>

        {/* Número de Documento y Teléfono */}
        <div className="grid grid-cols-2 gap-3">
          {/* Número de Documento */}
          <label className="flex flex-col text-sm font-medium text-gray-700 gap-2">
            <span className="flex items-center gap-2">
              <IconId size={18} className="text-[#C73838]" />
              Documento
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

          {/* Número Telefónico */}
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
        </div>
      </div>

      {/* Botón de registro */}
      <button
        type="submit"
        className="w-full bg-gradient-to-r from-[#C73838] via-[#B11212] to-orange-500 hover:from-[#B11212] hover:via-[#8f0e0e] hover:to-orange-600 text-white font-bold py-3 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 mt-8 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2"
        style={{
          boxShadow: '0 6px 24px 0 rgba(199, 56, 56, 0.15)'
        }}
      >
        <span>Crear mi cuenta</span>
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

export default RegisterDialog;
