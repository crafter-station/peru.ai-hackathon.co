import HeroSection from "@/components/sections/hero/hero-section";
// import DetailsSection from "@/components/sections/details/details-section";
// import FAQSection from "@/components/sections/faq/faq-section";
// import JudgesSection from "@/components/sections/judges/judges-section";
// import SponsorsSection from "@/components/sections/sponsors/sponsors-section";
import FooterSection from "@/components/sections/footer/footer-section";
import FloatingNav from "@/components/navigation/floating-nav";

export default function Page() {
  return (
    <>
      <FloatingNav />
      <HeroSection />
      {/* <DetailsSection />
      <FAQSection />
      <JudgesSection />
      <SponsorsSection /> */}
      <FooterSection />
    </>
  );
}
