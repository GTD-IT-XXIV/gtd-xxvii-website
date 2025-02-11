"use client";
import React from "react";
import {ContainerScroll} from "./ui/containerScrollAnimation";
import Image from "next/image";
import escaperoomImage from "@/assets/images/escaperoom-image.webp";
import casefileImage from "@/assets/images/casefile-image.webp";
import logoNoctura from "@/assets/images/logo-noctura-escaperoom.webp";
import logoRectivia from "@/assets/images/logo-rectivia-casefile.webp";
import {Button} from "./ui/button";
import {useRouter} from "next/navigation";

const EventCard = () => {
  const router = useRouter();
  return (
    <>
      <div className="flex flex-col overflow-hidden">
        <ContainerScroll>
          <div className="w-full h-full relative">
            <Image
              src={escaperoomImage.src}
              alt="Escape Room Image"
              fill
              objectFit="cover"
              className="mx-auto rounded-2xl object-cover absolute inset-0 h-full object-right-bottom "
              draggable={false}
            />
            <div className="absolute inset-0 bg-black opacity-60"></div>
            <div className="absolute w-full py-3 px-3 sm:pl-16 sm:pr-10 top-1/2 -translate-y-1/2 z-10 min-h-0 grow flex flex-col sm:flex-row justify-center sm:justify-start items-center gap-4 sm:gap-20">
              <div className="grow sm:grow-0  text-center space-y-4 max-w-[40vw] sm:max-w-[35vw]">
                <Image src={logoRectivia} alt="Logo Noctura" className="object-cover" />
              </div>
              <div className="grow sm:grow-0 text-center space-y-4">
                <h1 className="text-lg sm:text-2xl font-headline">
                  <div className="text-gtd-background mb-1">Case File</div>
                  <div className="text-4xl sm:text-6xl lg:text-7xl text-amber-100 text-shadow-[0_0_4px_var(--tw-shadow-color)] shadow-amber-100 italic tracking-wider">
                    Rectivia
                  </div>
                  <div className="text-gtd-background mb-1 font-inter font-normal  text-xs sm:text-sm">
                    A deadly virus outbreak threatens the kingdom, and the newly appointed health
                    minister, Aldi, is appointed by the Queen to contain it. But as you assist him
                    in the investigation, strange events begin to unfold. Can you uncover the hidden
                    truth and find the cure before it&apos;s too late?
                  </div>
                  <div className="flex justify-center space-x-4 mt-3 font-inter">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() =>
                        window.open("https://www.instagram.com/p/DF7GNv0SPF3/", "_blank")
                      }
                      className="h-6 px-6 py-4 rounded-lg  bg-gtd-primary hover:opacity-80 hover:bg-gtd-primary hover:text-white text-white"
                    >
                      See Trailer
                    </Button>
                    <Button
                      type="button"
                      onClick={() => router.push("/register")}
                      className="h-6 px-6 py-4 rounded-lg  bg-gtd-secondary hover:opacity-80 hover:bg-gtd-secondary"
                    >
                      Register
                    </Button>
                  </div>
                </h1>
              </div>
            </div>
          </div>
        </ContainerScroll>
      </div>
      <div className="flex flex-col overflow-hidden">
        <ContainerScroll>
          <div className="w-full h-full relative">
            <Image
              src={casefileImage.src}
              alt="Escape Room Image"
              fill
              objectFit="cover"
              className="mx-auto rounded-2xl object-cover absolute inset-0 h-full object-right-bottom "
              draggable={false}
            />
            <div className="absolute inset-0 bg-black opacity-60"></div>
            <div className="absolute w-full py-3 px-3 sm:pr-16 sm:pl-10 top-1/2 -translate-y-1/2 z-10 min-h-0 grow flex flex-col sm:flex-row-reverse justify-center sm:justify-start items-center gap-4 sm:gap-20">
              <div className="grow sm:grow-0  text-center space-y-4 max-w-[40vw] sm:max-w-[35vw]">
                <Image src={logoNoctura} alt="Logo Noctura" className="object-cover" />
              </div>
              <div className="grow sm:grow-0 text-center space-y-4">
                <h1 className="text-lg sm:text-2xl font-headline">
                  <div className="text-gtd-background mb-1">Escape Room</div>
                  <div className="text-4xl sm:text-6xl lg:text-7xl text-red-200 text-shadow-[0_0_4px_var(--tw-shadow-color)] shadow-amber-100 italic tracking-wider">
                    Noctura
                  </div>
                  <div className="text-gtd-background mb-1 font-inter font-normal  text-xs sm:text-sm">
                    The Trolls&rsquo; biggest party of the year is interrupted when the Bergens
                    crash the celebration and start capturing them for a future feast. A small group
                    of brave Trolls must race against time to rescue their friends and escape Bergen
                    town before the guards return.
                  </div>
                  <div className="flex justify-center space-x-4 mt-3 font-inter">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() =>
                        window.open("https://www.instagram.com/p/DF7GelsSsl7/", "_blank")
                      }
                      className="h-6 px-6 py-4 rounded-lg  bg-gtd-primary hover:opacity-80 hover:bg-gtd-primary hover:text-white text-white"
                    >
                      See Trailer
                    </Button>
                    <Button
                      type="button"
                      onClick={() => router.push("/register")}
                      className="h-6 px-6 py-4 rounded-lg  bg-gtd-secondary hover:opacity-80 hover:bg-gtd-secondary"
                    >
                      Register
                    </Button>
                  </div>
                </h1>
              </div>
            </div>
          </div>
        </ContainerScroll>
      </div>
    </>
  );
};

export default EventCard;
