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
  IconArrowBackUp,
} from '@tabler/icons-react';
import Swal from "sweetalert2";

/**
 * Componente SellerRegisterDialog
 * Formulario de registro para vendedores.
 * Incluye campos adicionales relevantes para vendedores.
 */
const SellerRegisterDialog: React.FC = () => {
  // Estados locales para los campos del formulario
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [documentType, setDocumentType] = React.useState('cédula de ciudadanía');
  const [documentNumber, setDocumentNumber] = React.useState('');
  const [phoneNumber, setPhoneNumber] = React.useState('');
  const [username, setUsername] = React.useState('');
  const [gender, setGender] = React.useState('');
  const [age, setAge] = React.useState('');

  // Maneja el envío del formulario de registro de vendedor
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Las contraseñas no coinciden",
        background: "#fff0fa",
        color: "#a21caf",
        iconColor: "#a21caf",
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
          id_seller: documentNumber,
          document_type: documentType,
          seller_name: username,
          cellphone: phoneNumber,
          email,
          password,
          gender,
          age: Number(age),
          insurance: '',
          rating: '0',
        }),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        // Mostrar mensajes específicos de error si existen
        if (errorData.password && Array.isArray(errorData.password)) {
        alert('Error de contraseña: ' + errorData.password.join(' '));
        } else if (errorData.detail) {
        alert('Error: ' + errorData.detail);
        } else if (typeof errorData === 'object') {
          // Mostrar el primer error de cualquier campo
          const firstKey = Object.keys(errorData)[0];
          if (firstKey && Array.isArray(errorData[firstKey])) {
            alert(`${firstKey}: ${errorData[firstKey].join(' ')}`);
          } else {
            alert('Error en el registro');
          }
        } else {
          alert('Error en el registro');
        }
        return;
      }
      Swal.fire({
        icon: "success",
        title: "¡Registro de vendedor exitoso!",
        showConfirmButton: false,
        timer: 1800,
        background: "#fff0fa",
        color: "#a21caf",
        iconColor: "#a21caf",
      });
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setDocumentType('cédula de ciudadanía');
      setPhoneNumber('');
      setDocumentNumber('');
      setUsername('');
      setGender('');
      setAge('');
    }   catch (err: any) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Error al registrar vendedor: " + err.message,
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
      <div className="flex flex-col items-center gap-2 mb-2">
        <span className="bg-fuchsia-600 rounded-full p-3 shadow-lg mb-1">
          <IconUserPlus size={34} className="text-white" />
        </span>
        <h2 className="text-2xl font-extrabold text-center text-fuchsia-700 tracking-wide">
          Registro de vendedor
        </h2>
        <p className="text-xs text-gray-500 text-center max-w-xs">
          Completa el formulario para crear tu cuenta de vendedor y empezar a vender.
        </p>
      </div>
      {/* Email */}
      <label className="flex flex-col text-sm font-semibold text-gray-700 gap-1 relative">
        <span className="flex items-center gap-2">
          <IconMail size={18} className="text-fuchsia-500" />
          Email
        </span>
        <div className="relative">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 p-2 pl-10 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500 transition w-full"
            placeholder="tucorreo@email.com"
          />
        </div>
      </label>
      {/* Contraseña */}
      <label className="flex flex-col text-sm font-semibold text-gray-700 gap-1 relative">
        <span className="flex items-center gap-2">
          <IconLock size={18} className="text-fuchsia-500" />
          Contraseña
        </span>
        <div className="relative">
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 p-2 pl-10 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500 transition w-full"
            placeholder="Tu contraseña"
          />
        </div>
      </label>
      {/* Confirmar contraseña */}
      <label className="flex flex-col text-sm font-semibold text-gray-700 gap-1 relative">
        <span className="flex items-center gap-2">
          <IconLock size={18} className="text-fuchsia-500" />
          Confirmar contraseña
        </span>
        <div className="relative">
          <input
            type="password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="mt-1 p-2 pl-10 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500 transition w-full"
            placeholder="Repite tu contraseña"
          />
        </div>
      </label>
      {/* Tipo de Documento */}
      <label className="flex flex-col text-sm font-medium text-gray-700 gap-1 relative">
        <span className="flex items-center gap-2">
          <IconId size={18} className="text-fuchsia-500" />
          Tipo de Documento
        </span>
        <div className="relative">
          <select
            required
            value={documentType}
            onChange={(e) => setDocumentType(e.target.value)}
            className="mt-1 p-2 pl-10 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500 transition w-full"
          >
            <option value="cédula de ciudadanía">Cédula de Ciudadanía</option>
            <option value="tarjeta de identidad">Tarjeta de Identidad</option>
            <option value="pasaporte">Pasaporte</option>
            <option value="DNI">DNI</option>
          </select>
        </div>
      </label>
      {/* Número de Documento */}
      <label className="flex flex-col text-sm font-semibold text-gray-700 gap-1 relative">
        <span className="flex items-center gap-2">
          <IconId size={18} className="text-fuchsia-500" />
          Número de documento
        </span>
        <div className="relative">
          <input
            type="text"
            required
            value={documentNumber}
            onChange={(e) => setDocumentNumber(e.target.value)}
            className="mt-1 p-2 pl-10 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500 transition w-full"
            placeholder="Número de documento"
          />
        </div>
      </label>
      {/* Número Telefónico */}
      <label className="flex flex-col text-sm font-semibold text-gray-700 gap-1 relative">
        <span className="flex items-center gap-2">
          <IconPhone size={18} className="text-fuchsia-500" />
          Número telefónico
        </span>
        <div className="relative">
          <input
            type="tel"
            required
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="mt-1 p-2 pl-10 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500 transition w-full"
            placeholder="Tu número de celular"
          />
        </div>
      </label>
      {/* Nombre de Usuario */}
      <label className="flex flex-col text-sm font-semibold text-gray-700 gap-1 relative">
        <span className="flex items-center gap-2">
          <IconUserCircle size={18} className="text-fuchsia-500" />
          Nombre de usuario
        </span>
        <div className="relative">
          <input
            type="text"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="mt-1 p-2 pl-10 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500 transition w-full"
            placeholder="Elige tu usuario"
          />
        </div>
      </label>
      {/* Género */}
      <label className="flex flex-col text-sm font-semibold text-gray-700 gap-1 relative">
        <span className="flex items-center gap-2">
          {gender === "femenino" ? (
            <IconGenderFemale size={18} className="text-fuchsia-500" />
          ) : (
            <IconGenderMale size={18} className="text-fuchsia-500" />
          )}
          Género
        </span>
        <select
          required
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          className="mt-1 p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500 transition"
        >
          <option value="">Seleccione</option>
          <option value="masculino">Masculino</option>
          <option value="femenino">Femenino</option>
        </select>
      </label>
      {/* Edad */}
      <label className="flex flex-col text-sm font-semibold text-gray-700 gap-1 relative">
        <span className="flex items-center gap-2">
          <IconUser size={18} className="text-fuchsia-500" />
          Edad
        </span>
        <div className="relative">
          <input
            type="number"
            min="0"
            required
            value={age}
            onChange={(e) => setAge(e.target.value)}
            className="mt-1 p-2 pl-10 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500 transition w-full"
            placeholder="Tu edad"
          />
        </div>
      </label>
      {/* Botón de registro */}
      <button
        type="submit"
        className="mt-2 w-full bg-fuchsia-600 text-white font-bold py-2 rounded-lg shadow-xl hover:bg-fuchsia-700 hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 text-base focus:outline-none focus:ring-2 focus:ring-fuchsia-400"
        style={{
          boxShadow: '0 6px 24px 0 rgba(168, 85, 247, 0.13), 0 2px 8px 0 rgba(168, 85, 247, 0.13)'
        }}
      >
        <span>Registrar como vendedor</span>
        <IconUserPlus className="text-white" size={20} />
      </button>
      <div className="text-center text-xs text-gray-500 mt-2 flex items-center justify-center gap-1">
        <IconArrowBackUp size={16} className="text-fuchsia-400" />
        <span>¿Ya tienes una cuenta?</span>
        <button className="text-fuchsia-600 font-semibold hover:underline focus:outline-none">
          Iniciar sesión
        </button>
      </div>
    </form>
  );
};

export default SellerRegisterDialog;
