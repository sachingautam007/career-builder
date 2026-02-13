"use client";
import { CarouselAutoplay } from "@/components/CarouselAutoplay";
import { Button } from "./ui/button";
import Link from "next/link";
const HeroSection = () => {
  return (
     <section className="w-full pt-36 md:pt-48 pb-12">
  <div className="max-w-3xl mx-auto space-y-6 text-center">
    
    <div className="space-y-6">
      <h1 className="text-4xl font-bold md:text-5xl lg:text-6xl xl:text-7xl gradient-title">
        Helping Students
        <br />
        To Build Their Career
      </h1>
      <p className="mx-auto max-w-600px text-muted-foreground md:text-xl">
        This is a student mentor website where you can 
        get guidance and also you can prepare for Interviews.
      </p>
    </div>

    <div>
      <Link href="/industry-insights">
        <Button  className="text-lg px-8">
          Start today
        </Button>
      </Link>
    </div>

  </div>

    <div className="mt-14 flex justify-center">
      <CarouselAutoplay
        width={1280}
        height={960}
        className="rounded-lg shadow-2xl border mx-auto"
        priority
      />
    </div>
</section>

  );
};

export default HeroSection;
