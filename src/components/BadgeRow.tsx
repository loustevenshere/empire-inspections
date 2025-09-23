"use client";
import Image from "next/image";

export default function BadgeRow() {
  return (
    <div className="mx-auto mt-4 md:mt-6 max-w-3xl">
      <div className="mt-4 md:mt-6 h-px w-full bg-neutral-200/60 mx-auto" />
      <div aria-label="Trust badges" className="mt-4 md:mt-6 flex flex-wrap justify-center gap-4 md:gap-6 lg:gap-10">
        {/* Left Badge */}
        <div className="flex flex-col items-center gap-1 md:gap-2">
          <Image
            src="/badges/years-experience.v1.webp"
            alt="20+ Years Experience badge"
            width={160}
            height={160}
            sizes="(max-width: 768px) 33vw, 160px"
            loading="lazy"
            decoding="async"
            className="h-12 w-12 md:h-14 md:w-14 lg:h-16 lg:w-16 object-contain opacity-90 hover:opacity-100 hover:scale-105 drop-shadow-sm transition-transform transition-opacity duration-200 ease-in-out"
          />
          <span className="text-xs md:text-sm text-neutral-500 text-center">20+ Years Experience</span>
        </div>

        {/* Center Badge */}
        <div className="flex flex-col items-center gap-1 md:gap-2">
          <a
            href="https://www.pa.gov/agencies/dli/programs-services/labor-management-relations/bureau-of-occupational-and-industrial-safety/tpa-buildings/empire-electrical-solutions"
            target="_blank"
            rel="noopener noreferrer"
            className="block"
          >
            <Image
              src="/badges/pa-license-a000501.v1.webp"
              alt="PA License A000501 badge"
              width={160}
              height={160}
              sizes="(max-width: 768px) 33vw, 160px"
              loading="lazy"
              decoding="async"
              className="h-14 w-14 md:h-16 md:w-16 lg:h-18 lg:w-18 xl:h-20 xl:w-20 object-contain opacity-95 hover:opacity-100 hover:scale-105 drop-shadow-sm transition-transform transition-opacity duration-200 ease-in-out"
            />
          </a>
          <span className="text-xs md:text-sm text-neutral-500 text-center">PA License # A000501</span>
        </div>

        {/* Right Badge */}
        <div className="flex flex-col items-center gap-1 md:gap-2">
          <Image
            src="/badges/licensed-insured.v1.webp"
            alt="Licensed and Insured badge"
            width={160}
            height={160}
            sizes="(max-width: 768px) 33vw, 160px"
            loading="lazy"
            decoding="async"
            className="h-12 w-12 md:h-14 md:w-14 lg:h-16 lg:w-16 object-contain opacity-90 hover:opacity-100 hover:scale-105 drop-shadow-sm transition-transform transition-opacity duration-200 ease-in-out"
          />
          <span className="text-xs md:text-sm text-neutral-500 text-center">Licensed & Insured</span>
        </div>
      </div>
    </div>
  );
}
