/**
 * Componente NavbarDemo
 * Barra de navegación principal y móvil con lógica de usuario, búsqueda y menú.
 */
"use client";

import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  NavbarLogo,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from "./resizable-navbar";
import { useState, useEffect, useRef } from "react";
import AdvancedSearchBar from "../../search/Searchbar";
import { IconHome, IconShoppingCart, IconUser, IconShoppingBag, IconTrendingUp } from "@tabler/icons-react";
import { useCarrito } from "../../context/CartContext";
import AuthDialog from "../../auth/AuthDialog";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface NavbarDemoProps {
  onSearch?: (query: string) => void;
}

export function NavbarDemo({ onSearch }: NavbarDemoProps) {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isSeller, setIsSeller] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { carrito } = useCarrito();
  const cartCount = carrito?.length ?? 0;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    if (userMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [userMenuOpen]);

  // Leer usuario y seller de localStorage
  useEffect(() => {
    function updateUserFromStorage() {
      if (typeof window !== 'undefined') {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          try {
            const userObj = JSON.parse(storedUser);
            setUser(userObj);
            // isSeller es true si el rol es VENDEDOR
            setIsSeller(userObj?.rol === 'VENDEDOR');
          } catch {
            setUser(null);
            setIsSeller(false);
          }
        } else {
          setUser(null);
          setIsSeller(false);
        }
      }
    }
    updateUserFromStorage();
    window.addEventListener('userLogin', updateUserFromStorage);
    window.addEventListener('userLogout', updateUserFromStorage);
    return () => {
      window.removeEventListener('userLogin', updateUserFromStorage);
      window.removeEventListener('userLogout', updateUserFromStorage);
    };
  }, []);

  // Efecto para cambiar el estado de la navbar al hacer scroll
  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 100);
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Items comunes
  const leftNavCommon = [
    { name: "Productos", link: "/products", icon: <IconShoppingBag size={18} /> },
  ];

  // --- Render ---
  return (
    <div className="relative w-full">
      <Navbar>
        {/* Escritorio */}
        <NavBody visible={visible}>
          <NavbarLogo />
          
          {/* Botones de navegación - Izquierda */}
          <div className="hidden lg:flex items-center gap-2 flex-1">
            {leftNavCommon.map((item, idx) => (
              <Link
                key={`nav-button-${idx}`}
                href={item.link}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-black border border-red-200 rounded-lg bg-white hover:bg-red-50 hover:border-[#C73838] hover:text-[#C73838] transition-all duration-200 shadow-sm"
              >
                <span className="text-[#C73838]">{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            ))}

            {/* Mostrar "Vender" solo si es seller */}
            {isSeller && (
              <Link
                href="/vender"
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-black border border-red-200 rounded-lg bg-white hover:bg-red-50 hover:border-[#C73838] hover:text-[#C73838] transition-all duration-200 shadow-sm"
              >
                <span className="text-[#C73838]"><IconTrendingUp size={18} /></span>
                <span>Vender</span>
              </Link>
            )}
          </div>

          {/* Búsqueda y Usuario - Centro y Derecha */}
          <div className="flex items-center gap-3 justify-end flex-1 lg:flex-initial">
            <div className="w-full max-w-lg">
              <AdvancedSearchBar size="sm" onSearch={onSearch} />
            </div>
            <Link
              href="/cart"
              className="relative flex items-center justify-center w-20 h-10 rounded-full bg-white border border-red-200 hover:bg-red-50 hover:scale-105 transition-transform duration-150 p-0 overflow-visible z-10"
              aria-label="Ver carrito"
            >
              <IconShoppingCart size={16} className="text-[#C73838] m-0" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] rounded-full w-5 h-5 flex items-center justify-center transform translate-x-1/3 -translate-y-1/3">
                  {cartCount}
                </span>
              )}
            </Link>
            {/* Botón de usuario: foto si logueado, icono si no */}
            {user ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-[#C73838] shadow hover:bg-[#B11212] border border-[#C73838] text-white font-semibold transition z-10"
                  type="button"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  aria-label="Menú de usuario"
                  style={{ boxShadow: '0 2px 8px 0 rgba(199, 56, 56, 0.10)' }}
                  title={user.username || 'Perfil'}
                >
                  {(user.username || 'U').charAt(0).toUpperCase()}
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-red-200 z-50">
                    <button
                      onClick={() => {
                        router.push("/user/profile");
                        setUserMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-[#C73838] font-medium rounded-t-lg transition"
                    >
                      Mi Perfil
                    </button>
                    <button
                      onClick={() => {
                        localStorage.removeItem('token');
                        localStorage.removeItem('user');
                        localStorage.removeItem('sellerToken');
                        setUserMenuOpen(false);
                        window.dispatchEvent(new Event('userLogout'));
                        router.push('/');
                      }}
                      className="w-full text-left px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600 font-medium rounded-b-lg transition"
                    >
                      Cerrar sesión
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                className="flex items-center justify-center w-20 h-10 rounded-full bg-white shadow hover:bg-red-100 border border-red-200 transition z-10 relative"
                type="button"
                onClick={() => setAuthDialogOpen(true)}
                aria-label="Abrir diálogo de usuario"
                style={{ boxShadow: '0 2px 8px 0 rgba(199, 56, 56, 0.10)' }}
              >
                <IconUser size={24} className="text-[#C73838]" />
              </button>
            )}
          </div>
        </NavBody>

        {/* Móvil */}
        <MobileNav className="rounded-none shadow-none border-none">
          <MobileNavHeader>
            <NavbarLogo />
            <MobileNavToggle
              isOpen={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            />
          </MobileNavHeader>
          <MobileNavMenu
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
          >
            {/* Búsqueda móvil */}
            <div className="w-full mb-4">
              <AdvancedSearchBar size="sm" onSearch={onSearch} />
            </div>

            {/* Botones de navegación móvil */}
            <div className="flex flex-col gap-2 mb-4 w-full">
              {leftNavCommon.map((item, idx) => (
                <Link
                  key={`mobile-nav-button-${idx}`}
                  href={item.link}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-black border border-red-200 rounded-lg bg-white hover:bg-red-50 hover:border-[#C73838] hover:text-[#C73838] transition-all duration-200"
                >
                  <span className="text-[#C73838]">{item.icon}</span>
                  {item.name}
                </Link>
              ))}

              {isSeller && (
                <Link
                  href="/vender"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-black border border-red-200 rounded-lg bg-white hover:bg-red-50 hover:border-[#C73838] hover:text-[#C73838] transition-all duration-200"
                >
                  <span className="text-[#C73838]"><IconTrendingUp size={18} /></span>
                  Vender
                </Link>
              )}
            </div>

            {/* Sección de usuario/autenticación */}
            <div className="flex flex-col items-stretch w-full mt-4 gap-2">
              {user ? (
                <>
                  <button
                    className="flex items-center justify-center w-full px-4 py-3 rounded-lg bg-white shadow hover:bg-red-50 border border-red-200 transition z-10"
                    type="button"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      router.push("/profile");
                    }}
                    aria-label="Ir a mi perfil"
                    style={{ boxShadow: '0 2px 8px 0 rgba(199, 56, 56, 0.10)' }}
                  >
                    {user.photo ? (
                      <img src={user.photo} alt="Foto de perfil" className="w-6 h-6 rounded-full object-cover mr-2" />
                    ) : (
                      <IconUser size={20} className="text-[#C73838] mr-2" />
                    )}
                    <span className="text-sm font-medium text-black">Mi Perfil</span>
                  </button>
                  <button
                    className="w-full px-4 py-3 text-sm text-gray-700 bg-white border border-red-200 rounded-lg hover:bg-red-50 transition font-medium"
                    onClick={() => {
                      localStorage.removeItem('user');
                      localStorage.removeItem('token');
                      localStorage.removeItem('sellerToken');
                      setIsMobileMenuOpen(false);
                      window.dispatchEvent(new Event('userLogout'));
                    }}
                  >
                    Cerrar sesión
                  </button>
                </>
              ) : (
                <button
                  className="flex items-center justify-center w-full bg-gradient-to-r from-[#C73838] via-[#B11212] to-orange-500 hover:from-[#B11212] hover:via-[#8f0e0e] hover:to-orange-600 text-white font-bold rounded-lg shadow-xl transition-all px-4 py-3"
                  style={{
                    boxShadow: '0 6px 24px 0 rgba(199, 56, 56, 0.13), 0 2px 8px 0 rgba(199, 56, 56, 0.13)'
                  }}
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setAuthDialogOpen(true);
                  }}
                >
                  <IconUser size={20} className="text-white mr-2" />
                  Iniciar sesión
                </button>
              )}
            </div>
          </MobileNavMenu>
        </MobileNav>
      </Navbar>
      {/* Diálogo de autenticación */}
      <AuthDialog open={authDialogOpen} onOpenChange={setAuthDialogOpen} />
    </div>
  );
}