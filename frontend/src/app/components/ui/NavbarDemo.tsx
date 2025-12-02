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
import { IconHome, IconShoppingCart, IconUser } from "@tabler/icons-react";
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
    { name: "Productos", link: "/products" },
    { name: "Vender", link: "/vender" },
  ];

  // --- Render ---
  return (
    <div className="relative w-full">
      <Navbar>
        {/* Escritorio */}
        <NavBody visible={visible}>
          <NavbarLogo />
          <NavItems items={navItems} />
          <div className="flex items-center gap-1 w-full max-w-2xl justify-end transition-all duration-300">
            <div className="w-full max-w-lg flex-shrink transition-all duration-300">
              <AdvancedSearchBar size="sm" onSearch={onSearch} />
            </div>
            {/* Botón de usuario: foto si logueado, icono si no */}
            {user && user.token ? (
              <button
                className="flex items-center justify-center w-24 h-10 rounded-full bg-fuchsia-600 shadow hover:bg-fuchsia-700 border border-fuchsia-600 text-white font-semibold transition z-10 relative"
                type="button"
                onClick={() => router.push("/profile")}
                aria-label="Ir a perfil de usuario"
                style={{ boxShadow: '0 2px 8px 0 rgba(168, 85, 247, 0.10)' }}
              >
                Perfil
              </button>
            ) : (
              <button
                className="flex items-center justify-center w-10 h-10 rounded-full bg-white shadow hover:bg-fuchsia-100 border border-fuchsia-100 transition z-10 relative"
                type="button"
                onClick={() => setAuthDialogOpen(true)}
                aria-label="Abrir diálogo de usuario"
                style={{ boxShadow: '0 2px 8px 0 rgba(168, 85, 247, 0.10)' }}
              >
                <IconUser size={24} className="text-fuchsia-700" />
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
            <div className="flex flex-col gap-2 mb-4">
              {navItems.map((item, idx) => (
                <Link
                  key={`mobile-link-${idx}`}
                  href={item.link}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="relative text-black hover:text-orange-600 px-4 py-2 rounded transition"
                >
                  <span className="block text-black font-medium">{item.name}</span>
                </Link>
              ))}
            </div>
            <div className="flex flex-row justify-around gap-4 mb-4">
              <SidebarLink link={{ label: "Inicio", href: "/", icon: <IconHome size={22} className="text-fuchsia-500" /> }} />
              <SidebarLink link={{ label: "Carrito", href: "/carrito", icon: <IconShoppingCart size={22} className="text-fuchsia-500" /> }} />
              <SidebarLink link={{ label: "Perfil", href: "/profile", icon: <IconUser size={22} className="text-fuchsia-500" /> }} />
            </div>
            <div className="w-full mb-4">
              <AdvancedSearchBar size="sm" onSearch={onSearch} />
            </div>
            <div className="flex flex-col items-center w-full mt-2">
              {user ? (
                <>
                  <button
                    className="flex items-center justify-center w-12 h-12 rounded-full bg-white shadow hover:bg-fuchsia-100 border border-fuchsia-100 transition z-10 relative mb-2"
                    type="button"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      router.push("/profile");
                    }}
                    aria-label="Ir a mi perfil"
                    style={{ boxShadow: '0 2px 8px 0 rgba(168, 85, 247, 0.10)' }}
                  >
                    {user.photo ? (
                      <img src={user.photo} alt="Foto de perfil" className="w-10 h-10 rounded-full object-cover" />
                    ) : (
                      <IconUser size={32} className="text-fuchsia-700" />
                    )}
                  </button>
                  <button
                    className="w-full px-4 py-2 text-sm text-gray-700 bg-white border border-fuchsia-100 rounded-xl hover:bg-fuchsia-50 transition"
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
                  className="flex items-center justify-center w-full mt-2 bg-gradient-to-r from-fuchsia-600 via-fuchsia-400 to-orange-400 hover:from-fuchsia-700 hover:to-orange-500 text-white font-bold rounded-xl shadow-xl transition-all px-4 py-2"
                  style={{
                    boxShadow: '0 6px 24px 0 rgba(249, 115, 22, 0.13), 0 2px 8px 0 rgba(168, 85, 247, 0.13)'
                  }}
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setAuthDialogOpen(true);
                  }}
                >
                  <IconUser size={24} className="text-white mr-2" />
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