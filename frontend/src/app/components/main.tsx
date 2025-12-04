"use client";

import HeroBanner from "./home/HeroBanner";
import CategoriesGrid from "./home/CategoriesGrid";
import FeaturedProducts from "./home/FeaturedProducts";
import BestSeller from "./home/BestSeller";
import BenefitsSection from "./home/BenefitsSection";
import TechSection from "./home/TechSection";

const Main = () => {
  return (
    <section className="flex flex-col gap-20">
      <HeroBanner />
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
