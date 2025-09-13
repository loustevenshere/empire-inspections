"use client";
import Image from "next/image";

export default function BadgeRow() {
  return (
    <div className="mx-auto mt-6 max-w-3xl">
      <div className="mt-6 h-px w-full bg-neutral-200/60 mx-auto" />
      <div aria-label="Trust badges" className="mt-6 flex flex-wrap justify-center gap-6 md:gap-10">
        {/* Left Badge */}
        <div className="flex flex-col items-center gap-1">
          <Image
            src="/badges/years-experience.png"
            alt="20+ Years Experience badge"
            width={64}
            height={64}
            className="h-14 w-14 md:h-16 md:w-16 object-contain opacity-90 hover:opacity-100 hover:scale-105 drop-shadow-sm transition-transform transition-opacity duration-200 ease-in-out"
          />
          <span className="text-xs text-neutral-500">20+ Years Experience</span>
        </div>

        {/* Center Badge */}
        <div className="flex flex-col items-center gap-1">
          <Image
            src="/badges/pa-license-a000501.png"
            alt="PA License A000501 badge"
            width={80}
            height={80}
            className="h-18 w-18 md:h-20 md:w-20 object-contain opacity-95 hover:opacity-100 hover:scale-105 drop-shadow-sm transition-transform transition-opacity duration-200 ease-in-out"
          />
          <span className="text-xs text-neutral-500">PA License # A000501</span>
        </div>

        {/* Right Badge */}
        <div className="flex flex-col items-center gap-1">
          <Image
            src="/badges/licensed-insured.png"
            alt="Licensed and Insured badge"
            width={64}
            height={64}
            className="h-14 w-14 md:h-16 md:w-16 object-contain opacity-90 hover:opacity-100 hover:scale-105 drop-shadow-sm transition-transform transition-opacity duration-200 ease-in-out"
          />
          <span className="text-xs text-neutral-500">Licensed & Insured</span>
        </div>
      </div>
    </div>
  );
}
