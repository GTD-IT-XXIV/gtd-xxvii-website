"use client";

import {usePathname} from "next/navigation";
import Container from "./Container";
import Image from "next/image";
import logoGTDBlack from "@/assets/images/logo-gtd-black-transparent.png";
import Link from "next/link";

const Navbar = () => {
  const pathname = usePathname(); // Get the current path

  return (
    <div
      className={`w-screen border border-b-primary/10 z-50 bg-gtd-background font-inter ${
        pathname === "/" ? "fixed top-0" : "sticky top-0"
      }`}
    >
      <Container>
        <div className="flex items-center gap-3">
          <Link href="/">
            <Image
              src={logoGTDBlack}
              alt="Logo PINTU Get Together Day"
              className="h-8 w-12 object-cover"
            />
          </Link>
          <Link href="/">Home</Link>
          <Link href="/register">Register</Link>
          <Link href="/leaderboard">Leaderboard</Link>
        </div>
      </Container>
    </div>
  );
};

export default Navbar;
