"use client";

import Link from "next/link";
import {Button} from "./_components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl md:text-5xl">
          GTD XXVII Polog Project
        </h1>
        <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg">
          Choose between Escape Room or Case File
        </p>
        <Button asChild className="mt-5">
          <Link href="/register" className="">
            Register Now
          </Link>
        </Button>
      </div>
    </div>
  );
}
