import { forwardRef } from "react";

export const HeroOrbitTrack = forwardRef<SVGSVGElement>((_, ref) => {
  return (
    <svg
      ref={ref}
      className="hero-orbit-svg absolute inset-0 w-full h-full pointer-events-none z-0 hidden md:block overflow-visible"
      viewBox="0 0 1000 1000"
      preserveAspectRatio="none"
      fill="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient
          id="orbit-lower-fade-mask"
          x1="0"
          y1="0"
          x2="0"
          y2="1000"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
          <stop offset="48%" stopColor="#ffffff" stopOpacity="0.95" />
          <stop offset="60%" stopColor="#ffffff" stopOpacity="0.4" />
          <stop offset="72%" stopColor="#ffffff" stopOpacity="0.2" />
          <stop offset="85%" stopColor="#ffffff" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
        <mask id="orbit-mask">
          <rect
            x="-100"
            y="-100"
            width="1200"
            height="1200"
            fill="url(#orbit-lower-fade-mask)"
          />
        </mask>
      </defs>
      {/* Large screens (xl / 1280px+): Exact initial geometry */}
      <ellipse
        cx="500"
        cy="640"
        rx="580"
        ry="580"
        stroke="currentColor"
        strokeWidth="1"
        mask="url(#orbit-mask)"
        className="hidden xl:block text-blue-300/80 dark:text-blue-800/60"
      />
      {/* Compact desktop / laptop (1024px - 1279px): Reduced just a bit */}
      <ellipse
        cx="500"
        cy="590"
        rx="490"
        ry="510"
        stroke="currentColor"
        strokeWidth="1"
        mask="url(#orbit-mask)"
        className="hidden lg:max-xl:block text-blue-300/80 dark:text-blue-800/60"
      />
      {/* Tablet (768px - 1023px): Reduced just a bit */}
      <ellipse
        cx="500"
        cy="560"
        rx="445"
        ry="460"
        stroke="currentColor"
        strokeWidth="1"
        mask="url(#orbit-mask)"
        className="block lg:hidden text-blue-300/80 dark:text-blue-800/60"
      />
    </svg>
  );
});

HeroOrbitTrack.displayName = "HeroOrbitTrack";
export default HeroOrbitTrack;
