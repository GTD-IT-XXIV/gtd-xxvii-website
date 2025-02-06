"use client";

import HeroSection from "./_components/HeroSection";
import EventCard from "./_components/EventCard";
import {ReactLenis} from "lenis/dist/lenis-react.js";

export default function Home() {
  return (
    <div className="">
      <HeroSection />
      <EventCard />
    </div>
  );
}
