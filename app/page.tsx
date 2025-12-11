import SponsorsSection from "@/components/sections/sponsors/sponsors-section";
import HeroSection from "@/components/sections/hero/hero-section";
import RecapSection from "@/components/sections/recap/recap-section";
import DetailsSection from "@/components/sections/details/details-section";
import ChallengeSection from "@/components/sections/challenge/challenge-section";
import EvaluationSection from "@/components/sections/evaluation/evaluation-section";
import FAQSection from "@/components/sections/faq/faq-section";
import FooterSection from "@/components/sections/footer/footer-section";
import JudgesSection from "@/components/sections/judges/judges-section";
import PrizesSection from "@/components/sections/prizes/prizes-section";
import AgendaSection from "@/components/sections/agenda/agenda-section";
import TrophiesSection from "@/components/sections/trophies/trophies-section";

export default function Page() {
  return (
    <>
      <HeroSection />
      <RecapSection />
      <SponsorsSection />
      <JudgesSection />
      <PrizesSection />
      <TrophiesSection />
      <DetailsSection />
      <AgendaSection />
      <ChallengeSection />
      <EvaluationSection />
      <FAQSection />
      <FooterSection />
    </>
  );
}
