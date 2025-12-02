// Sidebar principal y contexto para controlar su estado (abierto/cerrado)
"use client";
import { cn } from "@/lib/utils";
import React, { useState, createContext, useContext } from "react";
import { AnimatePresence, motion } from "motion/react";
import { IconMenu2, IconX } from "@tabler/icons-react";
import Link from "next/link";

// Interfaz para los enlaces del sidebar
interface Links {
  label: string; // Texto a mostrar
  href: string; // URL destino
  icon: React.JSX.Element | React.ReactNode; // Icono asociado
}

// Props del contexto del sidebar
interface SidebarContextProps {
  open: boolean; // Si el sidebar está abierto
  setOpen: React.Dispatch<React.SetStateAction<boolean>>; // Función para cambiar el estado
  animate: boolean; // Si se debe animar el sidebar
}

// Contexto para compartir el estado del sidebar
const SidebarContext = createContext<SidebarContextProps | undefined>(
  undefined
);

// Hook para consumir el contexto del sidebar
export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};

// Proveedor del contexto del sidebar
export const SidebarProvider = ({
  children,
  open: openProp,
  setOpen: setOpenProp,
  animate = true,
}: {
  children: React.ReactNode;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  animate?: boolean;
}) => {
  // Estado local si no se provee desde fuera
  const [openState, setOpenState] = useState(false);

  // Usa el estado externo si se provee, si no usa el local
  const open = openProp !== undefined ? openProp : openState;
  const setOpen = setOpenProp !== undefined ? setOpenProp : setOpenState;

  return (
    <SidebarContext.Provider value={{ open, setOpen, animate: animate }}>
      {children}
    </SidebarContext.Provider>
  );
};

// Componente principal del sidebar, envuelve a los hijos con el contexto
export const Sidebar = ({
  children,
  open,
  setOpen,
  animate,
}: {
  children: React.ReactNode;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  animate?: boolean;
}) => {
  return (
    <SidebarProvider open={open} setOpen={setOpen} animate={animate}>
      {children}
    </SidebarProvider>
  );
};

// Cuerpo del sidebar: solo muestra el sidebar de escritorio
export const SidebarBody = (props: React.ComponentProps<typeof motion.div>) => {
  return (
    <>
      <DesktopSidebar {...props} />
      {/* MobileSidebar eliminado para que no aparezca en móvil */}
    </>
  );
};

// Sidebar de escritorio, animado y colapsable
export const DesktopSidebar = ({
  className,
  children,
  ...props
}: React.ComponentProps<typeof motion.div>) => {
  const { open, setOpen, animate } = useSidebar();
  return (
    <>
      <motion.div
        className={cn(
          "h-full px-4 py-4 hidden  md:flex md:flex-col bg-white w-[300px] shrink-0 border-r border-gray-200",
          className
        )}
        animate={{
          width: animate ? (open ? "300px" : "60px") : "300px",
        }}
        onMouseEnter={() => setOpen(true)} // Abre al pasar el mouse
        onMouseLeave={() => setOpen(false)} // Cierra al salir el mouse
        {...props}
      >
        {children}
      </motion.div>
    </>
  );
};

// Enlace individual del sidebar, muestra icono y texto (si está abierto)
export const SidebarLink = ({
  link,
  className,
  // Eliminamos onCarritoClick
  ...props
}: {
  link: Links;
  className?: string;
}) => {
  const { open, animate } = useSidebar();

  return (
    <Link
      href={link.href}
      className={cn(
        "flex items-center justify-start gap-2 group/sidebar py-2",
        className
      )}
      {...props}
    >
      {link.icon && (
        <span className="text-orange-500 group-hover/sidebar:text-fuchsia-500 transition-colors">{link.icon}</span>
      )}
      <motion.span
        animate={{
          display: animate ? (open ? "inline-block" : "none") : "inline-block",
          opacity: animate ? (open ? 1 : 0) : 1,
        }}
        className="text-black text-sm group-hover/sidebar:translate-x-1 transition duration-150 whitespace-pre inline-block !p-0 !m-0"
      >
        {link.label}
      </motion.span>
    </Link>
  );
};
