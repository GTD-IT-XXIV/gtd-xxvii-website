import React from "react";
import Image from "next/image";
import bgTopRegister from "./_assets/bg-top-register.webp";
import bgBotRegister from "./_assets/bg-bot-register.webp";

export default function RegisterLayout({children}: {children: React.ReactNode}) {
  return (
    <div className=" min-h-full bg-gtd-background relative">
      <div className="w-full h-[60vh] md:h-[80vh] fixed top-10 left-0 right-0 overflow-hidden ">
        <Image
          src={bgTopRegister}
          alt="Top Background"
          fill
          priority
          className="object-cover object-[center_bottom]"
        />
      </div>
      <div className="relative z-[5]">{children}</div>
      <div className="fixed -bottom-2 left-0 z-0 w-[250px] md:w-[350px]">
        <Image src={bgBotRegister} alt="Bottom Background" priority />
      </div>
    </div>
  );
}
