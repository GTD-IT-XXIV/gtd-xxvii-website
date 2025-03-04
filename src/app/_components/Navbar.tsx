"use client";

import {usePathname} from "next/navigation";
import Container from "./Container";
import Image from "next/image";
import logoGTDBlack from "@/assets/images/logo-gtd-black-transparent.png";
import Link from "next/link";
import {Home, Trophy} from "lucide-react"; // Import relevant icons

const Navbar = () => {
  const pathname = usePathname(); // Get the current path

  return (
    <div
      className={`w-screen border border-b-primary/10 z-50 bg-gtd-background font-inter ${
        pathname === "/" ? "fixed top-0" : "sticky top-0"
      }`}
    >
      <Container>
        <div className="flex items-center gap-0 text-gtd-primary font-inter text-sm">
          <Link href="/" className="pr-2 sm:pr-3">
            <Image
              src={logoGTDBlack}
              alt="Logo PINTU Get Together Day"
              className="h-8 w-12 object-cover"
            />
          </Link>

          <Link
            href="/"
            className="flex items-center gap-2 px-1 py-1 sm:px-3 sm:py-1 rounded-md sm:hover:bg-gray-200 transition"
          >
            <Home size={18} /> Home
          </Link>

          <Link
            href="/leaderboard"
            className="flex items-center gap-2 px-1 py-1 sm:px-3 sm:py-1 rounded-md sm:hover:bg-gray-200 transition"
          >
            <Trophy size={18} /> Leaderboard
          </Link>
        </div>
      </Container>
    </div>
  );
};

export default Navbar;
