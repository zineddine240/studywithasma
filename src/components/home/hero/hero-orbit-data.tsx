import type { ReactNode } from "react";
import {
  GraduationCap,
  Building2,
  ShieldCheck,
  Target,
  Euro,
  Compass,
} from "lucide-react";
import { FranceFlag, ItalyFlag } from "./CountryFlags";

// 8 Orbital node angular baselines separated by 45° (Math.PI / 4)
// Clockwise layout starting with France (-112.5°) and Italy (-67.5°) at the top crest
export const BASE_ANGLES = [
  -Math.PI / 2 - Math.PI / 8, // France (-112.5°)
  -Math.PI / 2 + Math.PI / 8, // Italy (-67.5°)
  -Math.PI / 8, // Scholarships (-22.5°)
  Math.PI / 8, // Visa Support (+22.5°)
  Math.PI / 2 - Math.PI / 8, // Advisory (+67.5°)
  Math.PI / 2 + Math.PI / 8, // €0 Tuition (+112.5°)
  Math.PI - Math.PI / 8, // Band 7.5+ (+157.5°)
  Math.PI + Math.PI / 8, // University (+202.5°)
];

// Initial Orbital Geometry for large screens: Center at (50%, 64.0%), rx: 58.0 / ry: 58.0
export const ORBIT_CENTER = { x: 50, y: 64.0 };
export const ORBIT_RADIUS = { rx: 58.0, ry: 58.0 };

// Fade thresholds matching the SVG orbit-mask vertical gradient
const FADE_START = 48;
const FADE_END = 85;

function getInitialOpacity(topPercent: number): number {
  if (topPercent <= FADE_START) return 1;
  if (topPercent >= FADE_END) return 0;
  const t = (topPercent - FADE_START) / (FADE_END - FADE_START);
  return 1 - t * t;
}

export function getOrbitPosition(angle: number) {
  const topVal = ORBIT_CENTER.y + ORBIT_RADIUS.ry * Math.sin(angle);
  return {
    left: `${(ORBIT_CENTER.x + ORBIT_RADIUS.rx * Math.cos(angle)).toFixed(2)}%`,
    top: `${topVal.toFixed(2)}%`,
    opacity: getInitialOpacity(topVal),
  };
}

export interface OrbitCardItem {
  id: string;
  icon: ReactNode;
  bgBadge: string;
  label: string;
  href: string;
  baseAngle: number;
  initialStyle: { left: string; top: string; opacity: number };
}

export const ORBIT_CARDS: OrbitCardItem[] = [
  {
    id: "france",
    icon: <FranceFlag className="w-6 h-6 sm:w-7 sm:h-7 xl:w-9 xl:h-9" />,
    bgBadge: "bg-blue-500/10",
    label: "France",
    href: "/destinations/france",
    baseAngle: BASE_ANGLES[0],
    initialStyle: getOrbitPosition(BASE_ANGLES[0]),
  },
  {
    id: "italy",
    icon: <ItalyFlag className="w-6 h-6 sm:w-7 sm:h-7 xl:w-9 xl:h-9" />,
    bgBadge: "bg-emerald-500/10",
    label: "Italy",
    href: "/destinations/italy",
    baseAngle: BASE_ANGLES[1],
    initialStyle: getOrbitPosition(BASE_ANGLES[1]),
  },
  {
    id: "scholarships",
    icon: (
      <GraduationCap className="w-5 h-5 sm:w-5.5 sm:h-5.5 xl:w-6 xl:h-6 text-blue-600 dark:text-blue-400" />
    ),
    bgBadge: "bg-blue-500/10",
    label: "Scholarships",
    href: "/destinations/italy",
    baseAngle: BASE_ANGLES[2],
    initialStyle: getOrbitPosition(BASE_ANGLES[2]),
  },
  {
    id: "visa",
    icon: (
      <ShieldCheck className="w-5 h-5 sm:w-5.5 sm:h-5.5 xl:w-6 xl:h-6 text-emerald-600 dark:text-emerald-400" />
    ),
    bgBadge: "bg-emerald-500/10",
    label: "Visa Support",
    href: "/study-abroad",
    baseAngle: BASE_ANGLES[3],
    initialStyle: getOrbitPosition(BASE_ANGLES[3]),
  },
  {
    id: "advisory",
    icon: (
      <Compass className="w-5 h-5 sm:w-5.5 sm:h-5.5 xl:w-6 xl:h-6 text-indigo-600 dark:text-indigo-400" />
    ),
    bgBadge: "bg-indigo-500/10",
    label: "Advisory",
    href: "/study-abroad",
    baseAngle: BASE_ANGLES[4],
    initialStyle: getOrbitPosition(BASE_ANGLES[4]),
  },
  {
    id: "dsu",
    icon: (
      <Euro className="w-5 h-5 sm:w-5.5 sm:h-5.5 xl:w-6 xl:h-6 text-blue-600 dark:text-blue-400" />
    ),
    bgBadge: "bg-blue-500/10",
    label: "€0 Tuition",
    href: "/destinations/italy",
    baseAngle: BASE_ANGLES[5],
    initialStyle: getOrbitPosition(BASE_ANGLES[5]),
  },
  {
    id: "ielts",
    icon: (
      <Target className="w-5 h-5 sm:w-5.5 sm:h-5.5 xl:w-6 xl:h-6 text-amber-600 dark:text-amber-400" />
    ),
    bgBadge: "bg-amber-500/10",
    label: "Band 7.5+",
    href: "/ielts",
    baseAngle: BASE_ANGLES[6],
    initialStyle: getOrbitPosition(BASE_ANGLES[6]),
  },
  {
    id: "university",
    icon: (
      <Building2 className="w-5 h-5 sm:w-5.5 sm:h-5.5 xl:w-6 xl:h-6 text-purple-600 dark:text-purple-400" />
    ),
    bgBadge: "bg-purple-500/10",
    label: "University",
    href: "/destinations",
    baseAngle: BASE_ANGLES[7],
    initialStyle: getOrbitPosition(BASE_ANGLES[7]),
  },
];
