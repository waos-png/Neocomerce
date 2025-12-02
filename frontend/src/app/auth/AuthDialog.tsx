import * as React from 'react';
import { useState } from 'react';
import LoginDialog from './login/LoginDialog';
import RegisterDialog from './register/RegisterDialog';
import SellerRegisterDialog from './register/SellerRegisterDialog';
import SellerLoginDialog from './login/SellerLoginDialog';

/**
 * Componente principal de diálogo de autenticación.
 * Permite alternar entre login y registro, tanto para usuarios como para vendedores.
 * Muestra el formulario correspondiente según el modo y el tipo de usuario seleccionado.
 */
const AuthDialog: React.FC<{ open: boolean; onOpenChange: (open: boolean) => void; showBackButton?: boolean }> = ({
  open,
  onOpenChange,
  showBackButton = false,
}) => {
  // Estado para alternar entre login y registro
  const [mode, setMode] = useState<'login' | 'register'>('login');
  // Estado para alternar entre usuario y vendedor
  const [isSeller, setIsSeller] = useState(false);

  if (!open) return null;

  // Estilos para el botón de cerrar
  const closeButtonStyle: React.CSSProperties = {
    position: 'absolute',
    top: '0.5rem',
    right: '0.5rem',
    background: 'transparent',
    border: 'none',
    fontSize: '1.5rem',
    cursor: 'pointer',
    color: '#666',
    transition: 'color 0.3s ease',
    zIndex: 10,
  };

  // Estilos base para los botones de alternancia
  const toggleButtonBaseStyle: React.CSSProperties = {
    background: 'transparent',
    border: 'none',
    fontWeight: 700,
    fontSize: '1.08rem',
    cursor: 'pointer',
    padding: '0.35rem 1.2rem',
    borderRadius: '0.7rem',
    letterSpacing: '0.01em',
    transition: 'color 0.3s, background 0.3s, transform 0.3s, box-shadow 0.3s',
    boxShadow: '0 1px 4px 0 rgba(168,85,247,0.07)',
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed top-0 left-0 w-screen h-screen max-h-[100dvh] bg-black/30 backdrop-blur-[2px] z-[1000] transition-opacity duration-500 ${
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        style={{ maxHeight: '100dvh', height: '100dvh' }}
        onClick={() => onOpenChange(false)}
      />
      {/* Contenedor principal */}
      <div
        className={`fixed top-1/2 left-1/2 z-[1010] w-[95vw] sm:w-[70vw] md:w-[44vw] lg:w-[32vw] xl:w-[26vw] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-3xl bg-white p-0 shadow-2xl border border-fuchsia-100 transition-transform duration-300 ${
          open ? 'scale-100 opacity-100 pointer-events-auto' : 'scale-95 opacity-0 pointer-events-none'
        }`}
        style={{
          minWidth: '320px',
          maxWidth: '420px',
          maxHeight: '92dvh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          background: 'rgba(255,255,255,0.98)',
        }}
      >
        {/* Botón cerrar o volver */}
        {showBackButton ? (
          <button
            onClick={() => onOpenChange(false)}
            aria-label="Volver"
            className="absolute top-2 left-2 flex items-center gap-1 text-gray-400 hover:text-fuchsia-700 transition-colors duration-200 p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-fuchsia-300"
            style={{ background: 'none', border: 'none', zIndex: 10 }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
            <span className="sr-only">Volver</span>
          </button>
        ) : (
          <button
            style={closeButtonStyle}
            onClick={() => onOpenChange(false)}
            aria-label="Cerrar diálogo"
            onMouseEnter={e => (e.currentTarget.style.color = '#a21caf')}
            onMouseLeave={e => (e.currentTarget.style.color = '#666')}
          >
            &times;
          </button>
        )}

        {/* Botones alternar login/register */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '0.5rem',
            marginBottom: '0.5rem',
            alignItems: 'center',
            background: 'linear-gradient(90deg, #f3e8ff 0%, #fff7ed 100%)',
            borderBottomWidth: '1px',
            borderBottomStyle: 'solid',
            borderBottomColor: '#f3e8ff',
            padding: '1.2rem 0 0.5rem 0',
          }}
        >
          <button
            style={{
              ...toggleButtonBaseStyle,
              color: mode === 'login' ? '#fff' : '#a21caf',
              background: mode === 'login' ? 'linear-gradient(90deg,#a21caf 60%,#f472b6 100%)' : 'transparent',
              boxShadow: mode === 'login' ? '0 2px 12px 0 rgba(168,85,247,0.10)' : 'none',
              transform: mode === 'login' ? 'scale(1.08)' : 'scale(1)',
            }}
            onClick={() => setMode('login')}
            type="button"
          >
            Iniciar sesión
          </button>
          <button
            style={{
              ...toggleButtonBaseStyle,
              color: mode === 'register' ? '#fff' : '#a21caf',
              background: mode === 'register' ? 'linear-gradient(90deg,#a21caf 60%,#f472b6 100%)' : 'transparent',
              boxShadow: mode === 'register' ? '0 2px 12px 0 rgba(168,85,247,0.10)' : 'none',
              transform: mode === 'register' ? 'scale(1.08)' : 'scale(1)',
            }}
            onClick={() => setMode('register')}
            type="button"
          >
            Registrarme
          </button>
        </div>

        {/* Área de scroll para el formulario */}
        <div
          style={{
            flex: 1,
            minHeight: 0,
            overflowY: 'auto',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
            gap: '2rem',
            padding: '1.5rem 0 1.5rem 0',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            background: 'linear-gradient(180deg, #f8fafc 0%, #fff 100%)',
          }}
          className="hide-scrollbar"
        >
          <div style={{ width: '100%', padding: '0 1.5rem' }}>
            {mode === 'login'
              ? (isSeller ? <SellerLoginDialog /> : <LoginDialog />)
              : (isSeller ? <SellerRegisterDialog /> : <RegisterDialog />)
            }
          </div>
          <label
            className="seller-mode-label text-gray-800"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1rem',
              cursor: 'pointer',
              userSelect: 'none',
              gap: '0.7rem',
              padding: '0.7rem 0',
              borderRadius: '0.7rem',
              background: '#f3e8ff',
              width: '100%',
              marginTop: 0,
              boxShadow: '0 1px 8px 0 rgba(168,85,247,0.07)',
              fontWeight: 600,
              letterSpacing: '0.01em',
            }}
          >
            <input
              type="checkbox"
              checked={isSeller}
              onChange={e => setIsSeller(e.target.checked)}
              style={{ accentColor: '#a21caf', width: '1.1rem', height: '1.1rem' }}
            />
            <span style={{ fontWeight: 600, color: '#222' }}>
              {mode === 'login' ? 'Iniciar sesión como vendedor' : 'Modo vendedor'}
            </span>
          </label>
        </div>
      </div>
    </>
  );
}

// Hide scrollbar for Chrome, Safari and Opera
// .hide-scrollbar::-webkit-scrollbar { display: none; }

export default AuthDialog;