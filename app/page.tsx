import { CtaBand } from "@/components/sections/CtaBand";
import { Hero } from "@/components/sections/Hero";
import { Process } from "@/components/sections/Process";
import { Products } from "@/components/sections/Products";
import { Qualifier } from "@/components/sections/Qualifier";
import { Testimonials } from "@/components/sections/Testimonials";
import { TrustBar } from "@/components/sections/TrustBar";
import { VisualBreak } from "@/components/sections/VisualBreak";
import { WhyUs } from "@/components/sections/WhyUs";

export default function Home() {
  return (
    <>
      <Hero />
      <TrustBar />
      <VisualBreak />
      <Qualifier />
      <Products />
      <Process />
      <Testimonials />
      <WhyUs />
      <CtaBand />
    </>
  );
}
