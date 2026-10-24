"use client";

import { forwardRef, useImperativeHandle, useRef } from "react";
import Image from "next/image";
import { gsap, isReducedMotion } from "@/lib/gsap";

export interface HeroPhotoCardsHandles {
  leftCard: HTMLDivElement | null;
  centerCard: HTMLDivElement | null;
  rightCard: HTMLDivElement | null;
}

export const HeroPhotoCards = forwardRef<HeroPhotoCardsHandles>((_, ref) => {
  const cardLeftRef = useRef<HTMLDivElement>(null);
  const cardCenterRef = useRef<HTMLDivElement>(null);
  const cardRightRef = useRef<HTMLDivElement>(null);

  useImperativeHandle(ref, () => ({
    get leftCard() {
      return cardLeftRef.current;
    },
    get centerCard() {
      return cardCenterRef.current;
    },
    get rightCard() {
      return cardRightRef.current;
    },
  }));

  // Hover handlers for the 3 center photo cards (rotate & lift smoothly)
  const handlePhotoCardHover = (
    card: "left" | "center" | "right",
    isEntering: boolean,
  ) => {
    if (isReducedMotion()) return;
    if (card === "left" && cardLeftRef.current) {
      gsap.to(cardLeftRef.current, {
        rotate: isEntering ? -2 : -8,
        scale: isEntering ? 1.05 : 1,
        y: isEntering ? -6 : 0,
        duration: 0.35,
        ease: "power2.out",
        overwrite: "auto",
      });
    } else if (card === "center" && cardCenterRef.current) {
      gsap.to(cardCenterRef.current, {
        scale: isEntering ? 1.04 : 1,
        y: isEntering ? -8 : 0,
        duration: 0.35,
        ease: "power2.out",
        overwrite: "auto",
      });
    } else if (card === "right" && cardRightRef.current) {
      gsap.to(cardRightRef.current, {
        rotate: isEntering ? 2 : 8,
        scale: isEntering ? 1.05 : 1,
        y: isEntering ? -6 : 0,
        duration: 0.35,
        ease: "power2.out",
        overwrite: "auto",
      });
    }
  };

  return (
    <div className="relative pt-2 sm:pt-8 md:mt-52 mb-4 sm:mb-6 md:mb-8 flex items-center justify-center z-20">
      {/* Left Card: Tilted Counter-Clockwise */}
      <div
        ref={cardLeftRef}
        style={{ transform: "rotate(-12deg)" }}
        onMouseEnter={() => handlePhotoCardHover("left", true)}
        onMouseLeave={() => handlePhotoCardHover("left", false)}
        className="photo-card-left relative w-28 sm:w-36 md:w-44 lg:w-54 aspect-4/5 rounded-2xl overflow-hidden shadow-md border-4 border-white dark:border-slate-800 z-10 cursor-pointer"
      >
        <Image
          src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=800&auto=format&fit=crop"
          alt="Students studying and planning university path"
          fill
          sizes="(max-width: 640px) 112px, (max-width: 1024px) 176px, 216px"
          className="object-cover"
          loading="eager"
          quality={75}
        />
      </div>

      {/* Center Card: Tall, Straight, Elevated in Front (Main LCP Asset) */}
      <div
        ref={cardCenterRef}
        onMouseEnter={() => handlePhotoCardHover("center", true)}
        onMouseLeave={() => handlePhotoCardHover("center", false)}
        className="photo-card-center relative w-32 sm:w-40 md:w-44 lg:w-54 aspect-4/5 rounded-2xl overflow-hidden shadow-xl border-4 border-white dark:border-slate-800 z-20 -mx-3 sm:-mx-5 md:-mx-6 cursor-pointer"
      >
        <Image
          src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=800&auto=format&fit=crop"
          alt="Students walking together on campus"
          fill
          sizes="(max-width: 640px) 140px, (max-width: 1024px) 192px, 224px"
          className="object-cover"
          priority
          quality={75}
        />
      </div>

      {/* Right Card: Tilted Clockwise */}
      <div
        ref={cardRightRef}
        style={{ transform: "rotate(12deg)" }}
        onMouseEnter={() => handlePhotoCardHover("right", true)}
        onMouseLeave={() => handlePhotoCardHover("right", false)}
        className="photo-card-right relative w-28 sm:w-36 md:w-44 lg:w-54 aspect-4/5 rounded-2xl overflow-hidden shadow-md border-4 border-white dark:border-slate-800 z-10 cursor-pointer"
      >
        <Image
          src="https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?q=80&w=800&auto=format&fit=crop"
          alt="Students outside university campus"
          fill
          sizes="(max-width: 640px) 112px, (max-width: 1024px) 176px, 216px"
          className="object-cover"
          loading="eager"
          quality={75}
        />
      </div>
    </div>
  );
});

HeroPhotoCards.displayName = "HeroPhotoCards";
export default HeroPhotoCards;
