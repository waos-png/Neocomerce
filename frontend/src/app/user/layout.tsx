"use client";
import React from "react";
import { NavbarDemo } from "@/app/components/ui/NavbarDemo";
import Footer from "@/app/components/footer";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="w-full min-h-screen flex flex-col">
      <div className="fixed top-3 left-0 w-full z-50">
        <NavbarDemo />
      </div>
      <div className="flex-1">
        {children}
      </div>
      <Footer />
    </main>
  );
}