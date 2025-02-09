"use client";

import HeroSection from "@/app/_components/HeroSection";
import EventCard from "@/app/_components/EventCard";
import {ReactLenis} from "lenis/react";

export default function Home() {
  return (
    <ReactLenis root>
      <div className="">
        <HeroSection />
        <EventCard />
      </div>
    </ReactLenis>
  );
}
