import React from "react";
import { FaInstagram, FaFacebook, FaWhatsapp, FaTwitter, FaLinkedin } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-t from-fuchsia-100 via-white to-white text-gray-800 text-sm mt-20">
      <div className="max-w-7xl mx-auto px-6 py-12 rounded-3xl shadow-2xl grid grid-cols-1 md:grid-cols-5 gap-8">
        {/* Columna 1 */}
        <div>
          <h4 className="text-fuchsia-700 font-bold mb-3 text-lg">Información de la empresa</h4>
          <a href="#" className="hover:text-fuchsia-500 transition-colors font-medium">● Link del DYSAI</a>
        </div>

        {/* Columna 2 */}
        <div>
          <h4 className="text-fuchsia-700 font-bold mb-3 text-lg">Atención al cliente</h4>
          <ul className="space-y-2">
            <li><a href="#" className="hover:text-fuchsia-500 transition-colors">● Política de devolución</a></li>
            <li><a href="#" className="hover:text-fuchsia-500 transition-colors">● Propiedad intelectual</a></li>
            <li><a href="#" className="hover:text-fuchsia-500 transition-colors">● Política de envíos</a></li>
            <li><a href="#" className="hover:text-fuchsia-500 transition-colors">● Reportar actividad sospechosa</a></li>
          </ul>
        </div>

        {/* Columna 3 */}
        <div>
          <h4 className="text-fuchsia-700 font-bold mb-3 text-lg">Ayuda</h4>
          <ul className="space-y-2">
            <li><a href="#" className="hover:text-fuchsia-500 transition-colors">● Centro de ayuda</a></li>
            <li><a href="#" className="hover:text-fuchsia-500 transition-colors">● Centro de seguridad</a></li>
            <li><a href="#" className="hover:text-fuchsia-500 transition-colors">● Protección de compras</a></li>
            <li><a href="#" className="hover:text-fuchsia-500 transition-colors">● Asóciate con nosotros</a></li>
          </ul>
        </div>

        {/* Columna 4 vacía para balance visual en desktop */}
        <div className="hidden md:block" />

        {/* Columna 5 - Redes y métodos de pago organizados */}
        <div className="flex flex-col items-center md:items-end h-full justify-between">
          {/* Redes sociales */}
          <div className="w-full mb-6">
            <h4 className="text-fuchsia-700 font-bold mb-3 text-lg text-center md:text-right">Conecta con nosotros</h4>
            <div className="flex space-x-3 justify-center md:justify-end">
              {[FaInstagram, FaFacebook, FaWhatsapp, FaTwitter, FaLinkedin].map((Icon, idx) => (
                <a
                  key={idx}
                  href="#"
                  className="bg-fuchsia-100 text-fuchsia-700 rounded-full p-3 hover:bg-fuchsia-500 hover:text-white transition-colors shadow-lg"
                  aria-label="Red social"
                >
                  <Icon size={22} />
                </a>
              ))}
            </div>
          </div>
          {/* Métodos de pago */}
          <div className="w-full mt-4">
            <h4 className="text-fuchsia-700 font-bold mb-3 text-lg text-center md:text-right">Aceptamos</h4>
            <div className="flex space-x-3 justify-center md:justify-end mb-4 space-x-3">
              <img src="/icons/payments/visa.svg" alt="Visa" className="h-8 w-auto grayscale hover:grayscale-0 transition" />
              <img src="/icons/payments/mastercard.svg" alt="MasterCard" className="h-8 w-auto grayscale hover:grayscale-0 transition" />
              <img src="/icons/payments/paypal.svg" alt="PayPal" className="h-8 w-auto grayscale hover:grayscale-0 transition" />
              <img src="/icons/payments/applepay.svg" alt="Apple Pay" className="h-11 w-auto grayscale hover:grayscale-0 transition" />
              <img src="/icons/payments/googlepay.svg" alt="Google Pay" className="h-11 w-auto grayscale hover:grayscale-0 transition" />
            </div>
          </div>
        </div>
      </div>

      {/* Legal inferior */}
      <div className="border-t border-fuchsia-200 text-center py-4 text-xs text-gray-500 mt-4">
        © 2025 <span className="font-semibold text-fuchsia-700">DYSAI-group</span>.
        <a href="#" className="mx-2 hover:text-fuchsia-500 transition-colors">Términos de uso</a>·
        <a href="#" className="mx-2 hover:text-fuchsia-500 transition-colors">Política de privacidad</a>·
        <a href="#" className="mx-2 hover:text-fuchsia-500 transition-colors">Derechos de autor reservados</a>
      </div>
    </footer>
  );
}