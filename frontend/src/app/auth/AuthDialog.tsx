import * as React from 'react';
import { useState } from 'react';
import LoginDialog from './login/LoginDialog';
import RegisterDialog from './register/RegisterDialog';
import SellerRegisterDialog from './register/SellerRegisterDialog';
import SellerLoginDialog from './login/SellerLoginDialog';
import { IconUser, IconBriefcase, IconX } from '@tabler/icons-react';

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
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [isSeller, setIsSeller] = useState(false);

  if (!open) return null;

  const toggleButtonStyle = (isActive: boolean): React.CSSProperties => ({
    background: isActive
      ? 'linear-gradient(135deg, #C73838 0%, #B11212 100%)'
      : '#f8f9fa',
    border: isActive ? 'none' : '2px solid #e9ecef',
    fontWeight: 600,
    fontSize: '0.9rem',
    cursor: 'pointer',
    padding: '0.7rem 1.2rem',
    borderRadius: '0.75rem',
    letterSpacing: '0.01em',
    transition: 'all 0.25s ease',
    color: isActive ? '#fff' : '#495057',
    boxShadow: isActive ? '0 4px 12px rgba(199, 56, 56, 0.2)' : 'none',
    transform: isActive ? 'translateY(-1px)' : 'translateY(0)',
  });

  const handleLoginSuccess = () => {
    onOpenChange(false);
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 max-h-[100dvh] bg-black/50 backdrop-blur-md z-[1000] transition-opacity duration-300 ${
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => onOpenChange(false)}
      />

      {/* Modal */}
      <div
        className={`fixed top-1/2 left-1/2 z-[1010] w-[95vw] sm:w-[90vw] md:w-[480px] -translate-x-1/2 -translate-y-1/2 rounded-3xl bg-white shadow-2xl transition-all duration-300 ${
          open ? 'scale-100 opacity-100 pointer-events-auto' : 'scale-90 opacity-0 pointer-events-none'
        }`}
        style={{
          maxHeight: '95dvh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          border: '1px solid rgba(199, 56, 56, 0.1)',
        }}
      >
        {/* Header */}
        <div
          style={{
            background: 'linear-gradient(135deg, #fff5f5 0%, #ffe8e8 100%)',
            padding: '2rem 1.5rem 1.5rem',
            position: 'relative',
            borderBottom: '1px solid rgba(199, 56, 56, 0.08)',
          }}
        >
          {/* Close Button */}
          <button
            onClick={() => onOpenChange(false)}
            className="absolute top-4 right-4 p-2 hover:bg-red-100/50 rounded-full transition-colors duration-200"
            aria-label="Cerrar"
          >
            <IconX size={24} className="text-gray-400 hover:text-[#C73838]" />
          </button>

          {/* Logo/Title */}
          <div className="text-center mb-2">
            <h1 className="text-3xl font-black text-[#C73838] mb-1">
              NeoCommerce
            </h1>
            <p className="text-sm font-medium text-gray-600">
              {isSeller ? 'Vende con nosotros' : 'Compra fácil y seguro'}
            </p>
          </div>

          {/* Tabs - Login/Register */}
          <div className="flex gap-2.5 mt-6">
            <button
              style={toggleButtonStyle(mode === 'login')}
              onClick={() => setMode('login')}
              type="button"
              className="flex-1 font-semibold"
            >
              Inicia Sesión
            </button>
            <button
              style={toggleButtonStyle(mode === 'register')}
              onClick={() => setMode('register')}
              type="button"
              className="flex-1 font-semibold"
            >
              Regístrate
            </button>
          </div>
        </div>

        {/* Contenido scrollable */}
        <div
          className="flex-1 overflow-y-auto"
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: '#C73838 #f0f0f0',
          }}
        >
          <style>{`
            .auth-scroll::-webkit-scrollbar {
              width: 5px;
            }
            .auth-scroll::-webkit-scrollbar-track {
              background: #f5f5f5;
            }
            .auth-scroll::-webkit-scrollbar-thumb {
              background: #C73838;
              border-radius: 3px;
            }
            .auth-scroll::-webkit-scrollbar-thumb:hover {
              background: #B11212;
            }
          `}</style>

          <div className="auth-scroll p-6">
            {mode === 'login'
              ? (isSeller
                  ? <SellerLoginDialog onSwitchToRegister={() => setMode('register')} onLoginSuccess={handleLoginSuccess} />
                  : <LoginDialog onSwitchToRegister={() => setMode('register')} onLoginSuccess={handleLoginSuccess} />
                )
              : (isSeller
                  ? <SellerRegisterDialog onSwitchToLogin={() => setMode('login')} />
                  : <RegisterDialog onSwitchToLogin={() => setMode('login')} />
                )
            }
          </div>
        </div>

        {/* Footer - Cliente/Vendedor Switch */}
        <div
          style={{
            background: 'linear-gradient(135deg, #f8f9fa 0%, #f0f1f3 100%)',
            padding: '1.5rem',
            borderTop: '1px solid rgba(199, 56, 56, 0.08)',
          }}
        >
          <p className="text-center text-xs font-medium text-gray-600 mb-3">
            ¿Cómo quieres acceder?
          </p>
          <div className="grid grid-cols-2 gap-2.5">
            <button
              style={toggleButtonStyle(!isSeller)}
              onClick={() => setIsSeller(false)}
              type="button"
              className="flex items-center justify-center gap-2 py-2.5"
            >
              <IconUser size={18} />
              <span className="font-medium">Como cliente</span>
            </button>
            <button
              style={toggleButtonStyle(isSeller)}
              onClick={() => setIsSeller(true)}
              type="button"
              className="flex items-center justify-center gap-2 py-2.5"
            >
              <IconBriefcase size={18} />
              <span className="font-medium">Como vendedor</span>
            </button>
          </div>
          <p className="text-center text-xs text-gray-500 mt-3">
            🔒 Tus datos están protegidos y cifrados
          </p>
        </div>
      </div>
    </>
  );
};

export default AuthDialog;