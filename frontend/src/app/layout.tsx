import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { NavbarDemo } from "@/app/components/ui/NavbarDemo";
import { SidebarProvider, SidebarBody, SidebarLink } from "@/app/components/ui/sidebar";
import { IconHome, IconShoppingCart, IconUser } from "@tabler/icons-react";
import Footer from "@/app/components/footer";
import { CartProvider } from "@/app/context/CartContext";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata = {
  title: "NeoCommerce | Tu tienda del futuro",
  description: "NeoCommerce es una plataforma de e-commerce moderna, rápida y segura.",
};


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body
        className={`
          ${geistSans.variable} 
          ${geistMono.variable} 
          antialiased 
          text-gray-900 
          dark:text-white 
          min-h-screen
        `}
      >
        <CartProvider>
          <SidebarProvider>
            {/* Navbar fijo en la parte superior */}
            <div className="fixed top-3 left-0 w-full z-50">
              <NavbarDemo />
            </div>
            <div className="flex min-h-screen w-full">
              {/* Sidebar de escritorio */}
              <aside className="hidden md:flex flex-col fixed top-0 left-0 h-screen w-10 bg-gray-50 z-60 border-r border-neutral-200 dark:border-neutral-700">
                <SidebarBody>
                  <SidebarLink link={{ label: "Inicio", href: "/", icon: <IconHome size={20} /> }} />
                  <SidebarLink link={{ label: "Carrito", href: "/cart", icon: <IconShoppingCart size={20} /> }} />
                  <SidebarLink link={{ label: "Perfil", href: "/user/profile", icon: <IconUser size={20} /> }} />
                </SidebarBody>
              </aside>
              {/* Contenedor principal */}
              <div className="flex-1 flex flex-col w-full md:ml-10">
                {/* Contenido principal */}
                <main>
                  {children}
                </main>
                <Footer />
              </div>
            </div>
          </SidebarProvider>
        </CartProvider>
      </body>
    </html>
  );
}

