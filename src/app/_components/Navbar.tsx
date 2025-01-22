"use client";
import Container from "./Container";
import Image from "next/image";
import logoGTDBlack from "@/assets/images/logo-gtd-black-transparent.png";
import Link from "next/link";
const Navbar = () => {
  return (
    <div className="sticky top-0 border border-b-primary/10 z-10 bg-white">
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
          <Link href="/about">About</Link>
        </div>
      </Container>
    </div>
  );
};

export default Navbar;
