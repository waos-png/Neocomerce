"use client";

interface Feature {
  title: string;
  description: string;
}

interface FeatureSectionProps {
  features?: Feature[];
}

const featuresDefault: Feature[] = [
  { title: "Tecnología avanzada", description: "Usamos IA y big data para recomendarte los mejores productos." },
  { title: "Soporte 24/7", description: "Nuestro equipo está disponible para ayudarte en cualquier momento." },
  { title: "Pagos seguros", description: "Tus compras están protegidas con los mejores estándares de seguridad." },
];

const TechSection: React.FC<FeatureSectionProps> = ({ features }) => {
  return (
    <section>
      <h3 className="inline-block text-2xl font-bold mb-6 text-[#C73838] border-l-4 border-[#e8710fff] pl-3 bg-gradient-to-r from-red-100 to-white rounded px-4 py-1">
        Nuestra tecnología
      </h3>

      <div className="grid md:grid-cols-3 gap-6 text-center">
        {(features ?? featuresDefault).map((f, i) => (
          <div
            key={i}
            className="bg-white rounded-xl p-6 shadow-lg transition-all hover:scale-105 hover:shadow-2xl hover:ring-2 hover:ring-red-500"
          >
            <h4 className="font-semibold text-xl mb-2 text-[#C73838]">{f.title}</h4>
            <p className="text-sm text-gray-700">{f.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TechSection;
