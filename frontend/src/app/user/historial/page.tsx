"use client";
import React from "react";
import { OrderList } from "./components/OrderList";

export default function HistorialPage() {
  return (
    <section className="flex justify-center w-full min-h-screen bg-gradient-to-br from-red-50 to-orange-50 pt-24 pb-10 px-2">
      <div className="w-full max-w-5xl">
        <OrderList showToggleButton={false} showInitially={true} />
      </div>
    </section>
  );
}