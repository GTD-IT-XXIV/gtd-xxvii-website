import React from "react";
import {motion, useScroll, useTransform} from "framer-motion";
import Image from "next/image";
import {useRef} from "react";
import heroImage from "@/assets/images/hero-image.webp";
import logoRectura from "@/assets/images/logo-rectura.webp";
import trolls1 from "@/assets/images/trolls/1.webp";
import trolls2 from "@/assets/images/trolls/2.webp";
import trolls3 from "@/assets/images/trolls/3.webp";
import trolls4 from "@/assets/images/trolls/4.webp";
import trolls5 from "@/assets/images/trolls/5.webp";
import trolls6 from "@/assets/images/trolls/6.webp";
import trolls7 from "@/assets/images/trolls/7.webp";
import trolls8 from "@/assets/images/trolls/8.webp";
import trolls9 from "@/assets/images/trolls/9.webp";
import trolls10 from "@/assets/images/trolls/10.webp";
import {Button} from "@/components/ui/button";
import InfiniteScrollTrolls from "./InfiniteScrollTrolls";
import {useRouter} from "next/navigation";

const animationOrder = {
  initial: 0,
  animation1: 0.35,
  finish1: 0.45,
  animation2: 0.55,
  finish2: 0.75,
  end: 1,
};

const HeroSection = () => {
  const router = useRouter();
  const targetRef = useRef<HTMLDivElement | null>(null);
  const {scrollYProgress} = useScroll({
    target: targetRef,
    offset: ["start end", "end end"],
  });

  const images = [
    {src: trolls1.src, alt: "trolls1"},
    {src: trolls2.src, alt: "trolls2"},
    {src: trolls3.src, alt: "trolls3"},
    {src: trolls4.src, alt: "trolls4"},
    {src: trolls5.src, alt: "trolls5"},
    {src: trolls6.src, alt: "trolls6"},
    {src: trolls7.src, alt: "trolls7"},
    {src: trolls8.src, alt: "trolls8"},
    {src: trolls9.src, alt: "trolls9"},
    {src: trolls10.src, alt: "trolls10"},
  ];

  const contentOpacity = useTransform(
    scrollYProgress,
    [animationOrder.animation1, animationOrder.finish1],
    [1, 0],
  );

  const contentPosition = useTransform(scrollYProgress, (pos) =>
    pos >= animationOrder.finish1 ? "relative" : "fixed",
  );

  // Transform for background container position
  const bgTransformY = useTransform(
    scrollYProgress,
    [animationOrder.animation2, animationOrder.finish2, animationOrder.end],
    ["0%", "23%", "-105%"],
  );

  // Transform for height scaling (cutting from top)
  const bgHeight = useTransform(
    scrollYProgress,
    [animationOrder.animation2, animationOrder.end],
    ["100%", "40%"],
  );

  // Transform for width scaling
  const bgWidth = useTransform(
    scrollYProgress,
    [animationOrder.animation2, animationOrder.finish2],
    ["100%", "95%"],
  );

  // Transform for border radius
  const bgBorderRadius = useTransform(
    scrollYProgress,
    [animationOrder.animation2, animationOrder.finish2],
    ["0px", "30px"],
  );

  // Transform for overlay opacity
  const overlayOpacity = useTransform(
    scrollYProgress,
    [animationOrder.animation2, animationOrder.finish2],
    [0.6, 0.4],
  );

  // Position state management
  const bgPosition = useTransform(scrollYProgress, (pos) =>
    pos < animationOrder.animation2 ? "fixed" : "fixed",
  );

  const imageScale = useTransform(
    scrollYProgress,
    [animationOrder.animation2, animationOrder.finish2],
    [1, 1.3],
  );

  const aboutTransformY = useTransform(
    scrollYProgress,
    [animationOrder.finish2, animationOrder.end],
    ["3%", "5%"],
  );

  return (
    <>
      <section ref={targetRef}>
        <div className="relative h-[400vh]">
          <motion.div
            className="top-0 w-screen h-screen overflow-hidden"
            style={{
              position: bgPosition,
              width: bgWidth,
              height: bgHeight,
              borderRadius: bgBorderRadius,
              y: bgTransformY,
              left: "50%",
              x: "-50%", // Center horizontally
              transformOrigin: "top",
            }}
          >
            <motion.img
              src={heroImage.src}
              alt="Hero Background"
              className="w-full h-full object-cover object-top"
              style={{
                scale: imageScale,
              }}
            />
            <motion.div
              className="absolute inset-0 bg-black"
              style={{
                opacity: overlayOpacity,
              }}
            />
          </motion.div>
          <motion.div
            className="w-screen top-1/2 -translate-y-1/2 z-10 min-h-0 grow flex flex-col md:flex-row justify-center md:justify-evenly items-center gap-10 md:gap-8"
            style={{
              position: contentPosition,
              opacity: contentOpacity,
            }}
          >
            <div className="relative grow md:grow-0 text-center space-y-4 max-w-[80vw] md:max-w-[50vw]">
              <div className="absolute inset-0 bg-black/70 blur-lg -z-10"></div>
              <Image src={logoRectura} alt="Logo Rectura" className="object-cover" />
            </div>
            <div className="grow md:grow-0 text-center space-y-4">
              <h1 className="text-lg md:text-2xl font-headline">
                <div className="text-gtd-background mb-1">Case File</div>
                <div className="text-4xl md:text-6xl lg:text-7xl text-amber-100 text-shadow-[0_0_4px_var(--tw-shadow-color)] shadow-amber-100 italic tracking-wider">
                  Rectivia
                </div>
                <p className="text-lg md:text-xl opacity-65 text-gtd-background">X</p>
                <div className="text-gtd-background mb-1">Escape Room</div>
                <div className="text-4xl md:text-6xl lg:text-7xl text-red-200 text-shadow-[0px_0px_4px_var(--tw-shadow-color)] shadow-red-200 italic tracking-wider">
                  Noctura
                </div>
                <div className="text-gtd-background mb-1 font-inter font-normal text-base">
                  23 Feb & 1 Mar 2025
                </div>
              </h1>
            </div>
          </motion.div>
          <motion.div
            className="h-[110vh] w-screen z-10 absolute bottom-0 flex flex-col"
            style={{y: aboutTransformY}}
          >
            <div className="px-10">
              <p className="font-bold text-2xl md:text-4xl font-inter mb-2 text-gtd-primary">
                Where Fun Meets Adventure.
              </p>
              <div>
                <p className="text-md md:text-xl font-sans text-gtd-primary">
                  Step into a world where teamwork, mystery, and excitement collide! More than just
                  a game, this is an experience designed to challenge your wits, strengthen
                  friendships, and ignite your competitive spirit. Each event is crafted to
                  transport you into a thrilling universe where every clue matters and every second
                  counts.
                </p>
                <div className="w-full my-10 relative border-gtd-primary/50 border-[1.5px]">
                  <div className="absolute left-0 w-1/2 border-[1.7px] border-gtd-primary"></div>
                </div>
              </div>
            </div>
            <div className="px-10">
              <p className="font-bold text-2xl md:text-4xl font-inter mb-2 text-gtd-primary">
                Help the
                <span className=" mx-2 md:mx-4 font-headline font-extrabold tracking-wider text-3xl md:text-5xl">
                  Music Kingdom
                </span>
                now!
              </p>
            </div>
            <InfiniteScrollTrolls images={images} />
            <Button
              onClick={() => router.push("/register")}
              className="relative left-1/2 -translate-x-1/2 items-center h-6 px-6 py-5 w-32 rounded-lg bg-gtd-secondary hover:opacity-80 hover:bg-gtd-secondary font-semibold text-lg"
            >
              Register
            </Button>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default HeroSection;
