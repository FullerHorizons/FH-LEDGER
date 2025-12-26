"use client";

import { Navigation } from "@/components/Navigation";
import Image from "next/image";

export default function Contacts() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navigation pageTitle="COMPANY / CONTACT DATABASE" />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="flex justify-center mb-8 sm:mb-12">
          <Image
            src="/fh_logo_-_full.png"
            alt="Fuller Horizons"
            width={400}
            height={200}
            className="w-full max-w-xs sm:max-w-md h-auto"
            priority
          />
        </div>

        <div className="text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl text-[var(--fh-navy)] tracking-wider">
            COMPANY / CONTACT DATABASE
          </h2>
          <p className="text-lg text-gray-600">Coming soon</p>
        </div>
      </main>
    </div>
  );
}
