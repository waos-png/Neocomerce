import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { NavbarDemo } from "@/app/components/ui/NavbarDemo";
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
          {/* Navbar fijo en la parte superior */}
          <div className="fixed top-3 left-0 w-full z-50">
            <NavbarDemo />
          </div>
          <div className="flex min-h-screen w-full flex-col">
            {/* Contenido principal */}
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
        </CartProvider>
      </body>
    </html>
  );
}

