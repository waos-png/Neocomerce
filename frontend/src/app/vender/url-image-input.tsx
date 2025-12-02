// components/ui/url-image-input.tsx
"use client";
import { useState } from "react";

export default function UrlImageInput({ onChange }: { onChange: (url: string) => void }) {
  const [url, setUrl] = useState("");

  return (
    <div className="space-y-2">
      <label className="block font-semibold">URL de la imagen</label>
      <input
        type="url"
        value={url}
        onChange={(e) => {
          setUrl(e.target.value);
          onChange(e.target.value);
        }}
        placeholder="https://..."
        className="w-full border p-2 rounded-md"
      />
      {url && (
        <img
          src={url}
          alt="Vista previa"
          className="w-48 h-48 object-cover border rounded-md"
          onError={() => alert("La URL no es válida o no carga la imagen")}
        />
      )}
    </div>
  );
}

