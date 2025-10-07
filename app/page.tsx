import SponsorsSection from "@/components/sections/sponsors/sponsors-section";
import HeroSection from "@/components/sections/hero/hero-section";
import CountdownSection from "@/components/sections/countdown/countdown-section";
import DetailsSection from "@/components/sections/details/details-section";
import ChallengeSection from "@/components/sections/challenge/challenge-section";
import EvaluationSection from "@/components/sections/evaluation/evaluation-section";
import FooterSection from "@/components/sections/footer/footer-section";

export default function Page() {
  return (
    <>
      <HeroSection />
      <CountdownSection />
      <SponsorsSection />
      <DetailsSection />
      <ChallengeSection />
      <EvaluationSection />
      <FooterSection />
    </>
  );
}
