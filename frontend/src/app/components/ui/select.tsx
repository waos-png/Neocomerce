// components/ui/select.tsx

import { useState } from "react";

export function Select({
  value,
  onValueChange,
  children,
}: {
  value: string;
  onValueChange: (v: string) => void;
  children: React.ReactNode;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onValueChange(e.target.value)}
      className="border border-orange-500 bg-[#1f1f1f] text-white rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-orange-500 shadow-sm"
    >
      {children}
    </select>
  );
}

export function SelectItem({ value, children }: { value: string; children: React.ReactNode }) {
  return (
    <option
      value={value}
      className="text-white bg-[#1f1f1f]"
    >
      {children}
    </option>
  );
}