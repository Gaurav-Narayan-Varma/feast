import Cuisines from "@/components/marketing/landing/cuisines";
import Hero from "@/components/marketing/landing/hero";
import HowItWorks from "@/components/marketing/landing/how-it-works";
import Testimonials from "@/components/marketing/landing/testimonials";
import NavBar from "@/components/marketing/navbar";
import { Playfair_Display } from "next/font/google";
const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
});

export default function Home() {
  return (
    <>
      <NavBar />
      <div className={playfairDisplay.className}>
        <Hero />
        <HowItWorks />
        <Cuisines />
        <Testimonials />
      </div>
    </>
  );
}
