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
import { SidebarLink } from "./sidebar";
import { IconHome, IconShoppingCart, IconUser, IconShoppingBag, IconTrendingUp } from "@tabler/icons-react";
import AuthDialog from "../../auth/AuthDialog";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface NavbarDemoProps {
  onSearch?: (query: string) => void;
}

export function NavbarDemo({ onSearch }: NavbarDemoProps) {
  // --- Estados ---
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // --- Efectos ---
  // Cerrar menú usuario al hacer click fuera
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

  // Leer usuario de localStorage
  useEffect(() => {
    function updateUserFromStorage() {
      if (typeof window !== 'undefined') {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          try {
            setUser(JSON.parse(storedUser));
          } catch {
            setUser(null);
          }
        } else {
          setUser(null);
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

  // --- Datos de navegación ---
  const navItems = [
    { name: "Productos", link: "/products", icon: <IconShoppingBag size={18} /> },
    { name: "Vender", link: "/vender", icon: <IconTrendingUp size={18} /> },
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
            {navItems.map((item, idx) => (
              <Link
                key={`nav-button-${idx}`}
                href={item.link}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-black border border-red-200 rounded-lg bg-white hover:bg-red-50 hover:border-[#C73838] hover:text-[#C73838] transition-all duration-200 shadow-sm"
              >
                <span className="text-[#C73838]">{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            ))}
          </div>

          {/* Búsqueda y Usuario - Centro y Derecha */}
          <div className="flex items-center gap-3 justify-end flex-1 lg:flex-initial">
            <div className="w-full max-w-lg">
              <AdvancedSearchBar size="sm" onSearch={onSearch} />
            </div>
            {/* Botón de usuario: foto si logueado, icono si no */}
            {user && user.token ? (
              <button
                className="flex items-center justify-center min-w-[100px] h-10 rounded-full bg-[#C73838] shadow hover:bg-[#B11212] border border-[#C73838] text-white font-semibold transition z-10 relative"
                type="button"
                onClick={() => router.push("/profile")}
                aria-label="Ir a perfil de usuario"
                style={{ boxShadow: '0 2px 8px 0 rgba(199, 56, 56, 0.10)' }}
              >
                Perfil
              </button>
            ) : (
              <button
                className="flex items-center justify-center w-10 h-10 rounded-full bg-white shadow hover:bg-red-100 border border-red-200 transition z-10 relative"
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
              {navItems.map((item, idx) => (
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
            </div>

            {/* Links rápidos */}
            <div className="flex flex-row justify-around gap-2 w-full mb-4 px-2">
              <SidebarLink link={{ label: "Inicio", href: "/", icon: <IconHome size={20} className="text-[#C73838]" /> }} />
              <SidebarLink link={{ label: "Carrito", href: "/carrito", icon: <IconShoppingCart size={20} className="text-[#C73838]" /> }} />
              <SidebarLink link={{ label: "Perfil", href: "/profile", icon: <IconUser size={20} className="text-[#C73838]" /> }} />
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