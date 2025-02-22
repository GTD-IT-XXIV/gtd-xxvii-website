import Image from "next/image";
import Link from "next/link";
import {Instagram, Linkedin} from "lucide-react";
import {TbBrandTiktok as Tiktok} from "react-icons/tb";

import {cn} from "@/lib/utils";

import logoGTD from "@/assets/images/logo-gtd-white-transparent.png";
import logoPINTU from "@/assets/images/logo-pintu-white.png";

export type FooterProps = {
  className?: string;
};

export default function Footer({className}: FooterProps) {
  return (
    <footer className={cn("py-8 px-12 bg-gtd-primary text-white space-y-3", className)}>
      <div className="flex items-center gap-2">
        <Image src={logoGTD} alt="Logo PINTU Get Together Day" className="h-14 w-28 object-cover" />
        <div className="space-y-2">
          <div className="text-[1.65rem] md:text-[2.05rem] font-semibold flex gap-2 items-center">
            <Image
              src={logoPINTU}
              alt="Logo PINTU"
              className="h-[1.3rem] md:h-6 w-[5.1rem] md:w-[6rem] object-cover"
            />
            <p>GTD</p>
          </div>
          <div className="flex gap-3">
            <Link
              id="footer-tiktok-button"
              data-umami-event="footer-tiktok-button"
              href="https://www.tiktok.com/@pintugtd"
              rel="noreferrer noopener"
              target="_blank"
            >
              <Tiktok className="size-4 md:size-6" />
            </Link>
            <Link
              id="footer-instagram-button"
              data-umami-event="footer-instagram-button"
              href="https://www.instagram.com/pintugtd"
              rel="noreferrer noopener"
              target="_blank"
            >
              <Instagram className="size-4 md:size-6" />
            </Link>
            <Link
              id="footer-linkedin-button"
              data-umami-event="footer-linkedin-button"
              href="https://www.linkedin.com/company/pintu-gtd/"
              rel="noreferrer noopener"
              target="_blank"
            >
              <Linkedin className="size-4 md:size-6" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
