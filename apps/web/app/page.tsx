import Chefs from "@/components/marketing/marketing-main/chefs";
import Cuisines from "@/components/marketing/marketing-main/cuisines";
import Footer from "@/components/marketing/marketing-main/footer";
import Hero from "@/components/marketing/marketing-main/hero";
import HowItWorks from "@/components/marketing/marketing-main/how-it-works";
import Testimonials from "@/components/marketing/marketing-main/testimonials";
import NavBar from "@/components/marketing/marketing-navbar";
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
        <Chefs />
        <Cuisines />
        <Testimonials />
        <Footer />
      </div>
    </>
  );
}
