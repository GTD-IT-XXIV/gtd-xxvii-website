"use client";
import React from "react";
import {ContainerScroll} from "./ui/containerScrollAnimation";
import Image from "next/image";
import escaperoomImage from "@/assets/images/escaperoom-image.webp";
import casefileImage from "@/assets/images/casefile-image.webp";
import logoNoctura from "@/assets/images/logo-noctura-escaperoom.webp";
import logoRectivia from "@/assets/images/logo-rectivia-casefile.webp";

const EventCard = () => {
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
            <div className="absolute w-full px-3 md:pl-16 md:pr-10 top-1/2 -translate-y-1/2 z-10 min-h-0 grow flex flex-col md:flex-row justify-center md:justify-start items-center gap-8 md:gap-20">
              <div className="grow md:grow-0  text-center space-y-4 max-w-[60vw] md:max-w-[35vw]">
                <Image src={logoRectivia} alt="Logo Noctura" className="object-cover" />
              </div>
              <div className="grow md:grow-0 text-center space-y-4">
                <h1 className="text-lg md:text-2xl font-headline">
                  <div className="text-gtd-background mb-1">Escape Room</div>
                  <div className="text-4xl md:text-6xl lg:text-7xl text-amber-100 text-shadow-[0_0_4px_var(--tw-shadow-color)] shadow-amber-100 italic tracking-wider">
                    Rectivia
                  </div>
                  <div className="text-gtd-background mb-1 font-inter font-normal  text-xs md:text-sm">
                    Step into a world where teamwork, mystery, and excitement collide! More than
                    just a game, this is an experience designed to challenge your wits, strengthen
                    friendships, and ignite your competitive spirit. Each event is crafted to
                    transport you into a thrilling universe where every clue matters and every
                    second counts.
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
            <div className="absolute w-full px-3 md:pr-16 md:pl-10 top-1/2 -translate-y-1/2 z-10 min-h-0 grow flex flex-col md:flex-row-reverse justify-center md:justify-start items-center gap-8 md:gap-20">
              <div className="grow md:grow-0  text-center space-y-4 max-w-[60vw] md:max-w-[35vw]">
                <Image src={logoNoctura} alt="Logo Noctura" className="object-cover" />
              </div>
              <div className="grow md:grow-0 text-center space-y-4">
                <h1 className="text-lg md:text-2xl font-headline">
                  <div className="text-gtd-background mb-1">Case File</div>
                  <div className="text-4xl md:text-6xl lg:text-7xl text-amber-100 text-shadow-[0_0_4px_var(--tw-shadow-color)] shadow-amber-100 italic tracking-wider">
                    Noctura
                  </div>
                  <div className="text-gtd-background mb-1 font-inter font-normal  text-xs md:text-sm">
                    Step into a world where teamwork, mystery, and excitement collide! More than
                    just a game, this is an experience designed to challenge your wits, strengthen
                    friendships, and ignite your competitive spirit. Each event is crafted to
                    transport you into a thrilling universe where every clue matters and every
                    second counts.
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
