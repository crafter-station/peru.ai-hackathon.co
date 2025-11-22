import SponsorsSection from "@/components/sections/sponsors/sponsors-section";
import HeroSection from "@/components/sections/hero/hero-section";
import DetailsSection from "@/components/sections/details/details-section";
import ChallengeSection from "@/components/sections/challenge/challenge-section";
import EvaluationSection from "@/components/sections/evaluation/evaluation-section";
import FAQSection from "@/components/sections/faq/faq-section";
import FooterSection from "@/components/sections/footer/footer-section";
import JudgesSection from "@/components/sections/judges/judges-section";

export default function Page() {
  return (
    <>
      <HeroSection />
      <SponsorsSection />
      <JudgesSection />
      <DetailsSection />
      <ChallengeSection />
      <EvaluationSection />
      <FAQSection />
      <FooterSection />
    </>
  );
}
