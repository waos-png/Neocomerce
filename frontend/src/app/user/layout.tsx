"use client";
import React from "react";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="w-full min-h-screen flex flex-col">
      <div className="flex-1">{children}</div>
    </main>
  );
}