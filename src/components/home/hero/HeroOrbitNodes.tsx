"use client";

import { useRef, useCallback } from "react";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import { gsap, isReducedMotion } from "@/lib/gsap";
import { ORBIT_CARDS, ORBIT_CENTER } from "./hero-orbit-data";

// Precalculated mathematical constants outside component lifecycle
const FADE_START = 48; // top % where fade begins (full opacity above)
const FADE_END = 85;   // top % where opacity reaches ~0
const INV_FADE_RANGE = 1 / (FADE_END - FADE_START); // precomputed reciprocal (1/37)
const TWO_PI = Math.PI * 2;

// Fast quadratic opacity falloff with zero division in loop
function getNodeOpacity(topPercent: number): number {
  if (topPercent <= FADE_START) return 1;
  if (topPercent >= FADE_END) return 0;
  const t = (topPercent - FADE_START) * INV_FADE_RANGE;
  return 1 - t * t;
}

// Compute geometry matching Tailwind breakpoints and SVG track
function calculateGeometry(winWidth: number) {
  if (winWidth >= 1280) {
    // Large screen (xl: 1280px+): matches xl SVG track (cx: 500, cy: 640, rx: 580, ry: 580)
    return { rx: 58.0, ry: 58.0, cy: 64.0, isMobile: false };
  }
  if (winWidth >= 1024) {
    // Compact desktop / laptop (lg: 1024px - 1279px): matches lg SVG track (cx: 500, cy: 590, rx: 490, ry: 510)
    return { rx: 49.0, ry: 51.0, cy: 59.0, isMobile: false };
  }
  if (winWidth >= 768) {
    // Tablet (md: 768px - 1023px): matches md SVG track (cx: 500, cy: 560, rx: 445, ry: 460)
    return { rx: 44.5, ry: 46.0, cy: 56.0, isMobile: false };
  }
  // Mobile (<768px): hidden in DOM via md:block, pause ticker to save battery/CPU
  return { rx: 44.5, ry: 46.0, cy: 56.0, isMobile: true };
}

export function HeroOrbitNodes() {
  const containerRef = useRef<HTMLDivElement>(null);
  const orbitNodesRef = useRef<(HTMLDivElement | null)[]>([]);
  const orbitTweenRef = useRef<gsap.core.Tween | null>(null);

  // Stable hover handlers to smoothly decelerate/pause the orbit for easy reading
  const handleCardMouseEnter = useCallback(() => {
    if (orbitTweenRef.current) {
      gsap.to(orbitTweenRef.current, {
        timeScale: 0,
        duration: 0.4,
        overwrite: true,
      });
    }
  }, []);

  const handleCardMouseLeave = useCallback(() => {
    if (orbitTweenRef.current) {
      gsap.to(orbitTweenRef.current, {
        timeScale: 1,
        duration: 0.6,
        overwrite: true,
      });
    }
  }, []);

  useGSAP(
    () => {
      if (isReducedMotion()) return;

      // Cache geometry in memory; avoid window.innerWidth layout query on every 60fps frame
      let geometry = calculateGeometry(
        typeof window !== "undefined" ? window.innerWidth : 1440
      );

      // Bitmask tracking to avoid redundant DOM pointerEvents style mutations
      const pointerState = new Uint8Array(ORBIT_CARDS.length);

      const handleResize = () => {
        geometry = calculateGeometry(window.innerWidth);
        if (geometry.isMobile) {
          orbitTweenRef.current?.pause();
        } else if (orbitTweenRef.current?.paused()) {
          orbitTweenRef.current.play();
        }
      };

      window.addEventListener("resize", handleResize, { passive: true });

      // Pause animation when tab is inactive to preserve CPU / battery
      const handleVisibilityChange = () => {
        if (document.hidden) {
          orbitTweenRef.current?.pause();
        } else if (!geometry.isMobile) {
          orbitTweenRef.current?.play();
        }
      };
      document.addEventListener("visibilitychange", handleVisibilityChange);

      // Continuous 360° orbital revolution around the circle track (Clockwise)
      const orbitObj = { progress: 0 };
      const nodes = orbitNodesRef.current;
      const count = ORBIT_CARDS.length;

      orbitTweenRef.current = gsap.to(orbitObj, {
        progress: 1,
        duration: 38,
        repeat: -1,
        ease: "none",
        paused: geometry.isMobile,
        onUpdate: () => {
          const { rx, ry, cy } = geometry;
          const prog = orbitObj.progress;

          for (let i = 0; i < count; i++) {
            const node = nodes[i];
            if (!node) continue;
            const card = ORBIT_CARDS[i];
            const angle = card.baseAngle + prog * TWO_PI;
            const left = ORBIT_CENTER.x + rx * Math.cos(angle);
            const top = cy + ry * Math.sin(angle);
            const opacity = getNodeOpacity(top);

            node.style.left = `${left.toFixed(2)}%`;
            node.style.top = `${top.toFixed(2)}%`;
            node.style.opacity = `${opacity.toFixed(2)}`;

            // Only update pointerEvents when crossing threshold to eliminate DOM style thrashing
            const isClickable = opacity >= 0.1 ? 1 : 0;
            if (pointerState[i] !== isClickable) {
              pointerState[i] = isClickable;
              node.style.pointerEvents = isClickable ? "auto" : "none";
            }
          }
        },
      });

      return () => {
        window.removeEventListener("resize", handleResize);
        document.removeEventListener("visibilitychange", handleVisibilityChange);
        orbitTweenRef.current?.kill();
      };
    },
    { scope: containerRef },
  );

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none z-10 hidden md:block"
    >
      {ORBIT_CARDS.map((card, idx) => (
        <div
          key={card.id}
          ref={(el) => {
            orbitNodesRef.current[idx] = el;
          }}
          style={card.initialStyle}
          onMouseEnter={handleCardMouseEnter}
          onMouseLeave={handleCardMouseLeave}
          className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto will-change-transform"
        >
          <div className="orbit-card-inner will-change-transform">
            <Link
              href={card.href}
              className="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl border-2 border-slate-200/80 dark:border-slate-800 shadow-md shadow-slate-200/60 dark:shadow-none px-4 py-3 sm:px-5 sm:py-3.5 xl:px-6 xl:py-4.5 flex flex-col items-center justify-center gap-1.5 sm:gap-2 min-w-[120px] sm:min-w-[140px] xl:min-w-[165px] text-center hover:border-blue-500 dark:hover:border-blue-400 hover:shadow-xl transition-all duration-300 hover:scale-105 group block"
            >
              <div
                className={`w-10 h-10 sm:w-11 sm:h-11 xl:w-13 xl:h-13 rounded-xl sm:rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 ${card.bgBadge}`}
              >
                {card.icon}
              </div>
              <span className="text-xs sm:text-xs xl:text-sm font-extrabold text-slate-900 dark:text-white tracking-tight whitespace-nowrap">
                {card.label}
              </span>
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}

export default HeroOrbitNodes;
