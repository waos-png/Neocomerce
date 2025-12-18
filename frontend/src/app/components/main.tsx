"use client";

import HeroBanner from "./home/HeroBanner";
import CategoriesGrid from "./home/CategoriesGrid";
import FeaturedProducts from "./home/FeaturedProducts";
import BestSeller from "./home/BestSeller";
import BenefitsSection from "./home/BenefitsSection";
import TechSection from "./home/TechSection";

const Main = () => {
  return (
    <section className="flex flex-col">
      <HeroBanner
        topColor="#3b0202"
        bottomColor="#ff000d"
        intensity={1.6}
        rotationSpeed={0.4}
        glowAmount={0.003}
        pillarWidth={3.3}
        pillarHeight={0.4}
        noiseIntensity={0.4}
        pillarRotation={54}
        interactive={false}
        mixBlendMode="normal"
        bannerHeight="75vh"
      />

      {/* Degradado de transición (suavizado con varias paradas de color) */}
      <div className="h-32 smooth-transition-gradient" />

      <CategoriesGrid />

      <div className="max-w-7xl mx-auto bg-white px-4 sm:px-10 py-16 flex flex-col gap-20">
        <FeaturedProducts />
        <BestSeller />
        <BenefitsSection />
        <TechSection />
      </div>
    </section>
  );
};

export default Main;

