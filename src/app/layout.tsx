import type {Metadata} from "next";
import {Inter, Lobster} from "next/font/google";
import "./globals.css";
import localFont from "next/font/local";
import Providers from "./providers";
import Navbar from "./_components/Navbar";

const tangak = localFont({
  src: [
    {
      path: "../../public/fonts/tangak.otf",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-tangak",
});

const kaftus = localFont({
  src: [
    {
      path: "../../public/fonts/kaftus.ttf",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-kaftus",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const lobster = Lobster({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-lobster",
  display: "swap",
});

export const metadata: Metadata = {
  title: "PINTU Get Together Day",
  description: "Annual Indonesian Freshmen Orientation Camp at NTU",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`
        ${inter.variable} 
        ${kaftus.variable} 
        ${lobster.variable} 
        ${tangak.variable} 
        text-primary
      `}
      >
        <main className="flex flex-col min-h-screen">
          <Navbar />
          <section className="min-h-full">
            <Providers>{children}</Providers>
          </section>
        </main>
      </body>
    </html>
  );
}
