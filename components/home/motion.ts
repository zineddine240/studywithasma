"use client";

import type { Variants, Transition } from "framer-motion";

/**
 * Shared Framer Motion animation variants for the marketing website.
 *
 * Design system: Liquid Glass / Scroll-Triggered Storytelling
 * Motion tier: Standard (400–600ms, power2.out → Framer: [0.16, 1, 0.3, 1] cubic-bezier)
 * Guideline: always respect prefers-reduced-motion via framer-motion's built-in support.
 */

const transition: Transition = {
  duration: 0.55,
  ease: [0.16, 1, 0.3, 1], // cubic-bezier equivalent of power2.out
};

const transitionFast: Transition = {
  duration: 0.45,
  ease: [0.16, 1, 0.3, 1],
};

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: transitionFast },
};

export const fadeLeft: Variants = {
  hidden: { opacity: 0, x: -32 },
  visible: { opacity: 1, x: 0, transition },
};

export const fadeRight: Variants = {
  hidden: { opacity: 0, x: 32 },
  visible: { opacity: 1, x: 0, transition },
};

/**
 * Container variant that staggers its children.
 * Usage: wrap a list with <motion.div variants={staggerContainer}> and each
 * child with <motion.div variants={fadeUp}>.
 */
export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05,
    },
  },
};

/** Common viewport options: trigger when element enters the viewport. */
export const viewport = { once: true, margin: "0px 0px -80px 0px" } as const;
