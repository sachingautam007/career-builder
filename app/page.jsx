import { CarouselAutoplay } from "@/components/CarouselAutoplay";
import HeroSection from "@/components/hero";
import { Button } from "@/components/ui/button";
export default function Home() {
  return (
    <div>
     <div className="grid-background"></div>
      <HeroSection/>
      <CarouselAutoplay 
      width={1280}
      height={720}
      className="rounded-lg shadow-2xl border mx-auto"
      priority
      />
     </div>
  );
}
