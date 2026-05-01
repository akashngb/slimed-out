import { HeroSection } from "@/components/HeroSection";
import { UserFlowSection } from "@/components/UserFlowSection";
import { BrainSection } from "@/components/BrainSection";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <main className="w-full flex flex-col items-center justify-start overflow-hidden bg-bg">
      <HeroSection />
      <UserFlowSection />
      <BrainSection />
      <Footer />
    </main>
  );
}
