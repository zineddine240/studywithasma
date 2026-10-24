<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

# StudyWithAsma Project Rules & Architecture

## Technology Stack

- **Framework:** Next.js 16 (App Router), React 19
- **Styling:** Tailwind CSS v4, shadcn/ui
- **Forms & Validation:** React Hook Form, Zod, shadcn field
- **Data Fetching & State:** TanStack React Query (@tanstack/react-query)
- **Backend (Auth, DB, Storage):** Supabase (Cloud managed version)
- **AI Integration:** Google Gemini API (`@google/genai`)

## Project Constraints

- **Hosting Strategy:** Deployed on Vercel with a managed Cloud Supabase database instance.

## AI Workflow & Generation

- **Admin-Only Pattern:** The Gemini API must ONLY be triggered from Admin-protected routes/dashboards.
- **Pre-Generation:** Admins generate IELTS practice materials and English Level Tests beforehand.
- **Student Consumption:** Students read/take tests from the Supabase database. They do not trigger the Gemini API directly. This ensures predictable costs and quality control.

## Forms & Validation Pattern

We strictly use **Shadcn Field** components combined with **React Hook Form** (without the generic `<Form>` context wrapper).

**Example Implementation:**

```tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Field,
  FieldLabel,
  FieldContent,
  FieldError,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export function MyForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Field>
        <FieldLabel htmlFor="title">Title</FieldLabel>
        <FieldContent>
          <Input id="title" {...register("title")} />
        </FieldContent>
        <FieldError errors={[errors.title]} />
      </Field>
    </form>
  );
}
```

## Dropdown & Select Component Rules

- **Display Human-Readable Labels, Never Raw IDs/Values:** When using `<Select>` or custom pickers for items with UUIDs or internal keys (such as course IDs, student profile IDs, or expiry duration codes), always ensure `<SelectValue>` displays the human-readable label (e.g. course title, student name & email, humanized duration label) instead of falling back to the raw ID/value.

# User Preferences

- **Toasting & Notifications:** Always use `shadcn sonner` (`toast` from `sonner`) for all error and success messages across the application. Do not use native browser `alert()` or `window.alert()`.

# Environment Variables

- **Never call `process.env.*` directly in business logic.** All environment variables must be imported from `@/utils/env`.
- `src/utils/env.ts` is the single source of truth for all env vars in the project.
- **Public vars** (`NEXT_PUBLIC_*`) are exported as plain constants: `export const SUPABASE_URL = ...`
- **Server-only vars** are exported as getter functions that throw a descriptive error if missing: `export const GEMINI_API_KEY = () => requireServerEnv("GEMINI_API_KEY")`
- The only allowed exception is `process.env.NODE_ENV` for framework-level checks (e.g. in `providers.tsx`).

# Project Structure & Directory Organization

- **`src/` Directory Standard:** All application source code is maintained inside `src/`:
  - `src/app/`: Next.js App Router routes, layouts, and page clients.
  - `src/components/`: Reusable React components (UI, layouts, forms, sections).
  - `src/lib/`: Business logic, GSAP animations, data stores, API clients.
  - `src/utils/`: Supabase clients, env config, and helper utilities.
  - `src/proxy.ts`: Next.js session middleware proxy.
- **Path Alias:** `@/*` maps strictly to `./src/*` in `tsconfig.json`.

# Design System & Visual Rhythm (Porbe Architecture)

- **Color Harmony & Signature Blocks:**
  - High-impact saturated Royal Blue (`#183ce4` / `bg-blue-600`) blocks with white text for the About Impact, Quote Banner, Blog, and Closing CTA sections.
  - Saturated amber/gold pill buttons (`bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold px-8 py-3.5 rounded-full`) with circular dark arrow icons.
  - Soft pastel icon badges for services and cards (`bg-blue-500/10`, `bg-amber-500/10`, `bg-indigo-500/10`, etc.).
- **Visual Rhythm & Layout Structure:**
  - Hero with orbital constellation track (dashed ring), central photo cards, and floating country/feature badges.
  - Floating dark search / pathway finder card immediately below the hero.
  - 6-card soft grid for services with "Read More →" links.
  - 5-stage alternating working process roadmap (`01` to `05`) connected by dotted lines, followed by wide media photo.
  - 4 large circular stat badges for trust indicators (`Band 7.5+`, `98%`, `500+`, `€0 Tuition`).
  - 2-column clean card grid for FAQs with `+` / `-` toggles.
- **Fixed Container Width Standard (Porbe Standard):**
  - Strict adherence to `max-w-6xl mx-auto px-4 sm:px-6 lg:px-0` (1152px max width / Porbe 1140px Webflow grid) for all public page sections, floating navbar capsule, banners, and footer across all pages.
  - Do not use oversized outer container widths (e.g. `max-w-7xl` or `xl:max-w-[1360px]`). All page sections must align along the exact same vertical grid boundary.
  - Inner content constraints (e.g. `max-w-3xl` for contact form or `max-w-4xl` for blog reading column) must be nested cleanly inside the standard `max-w-6xl` container.
- **Section Tags / Kickers Design Standard (Strict Requirement):**
  - All section kickers/tags across all pages MUST use the Porbe square pip design:
    - **Light & Muted Sections:**
      ```tsx
      <SectionTag>{TAG_TEXT}</SectionTag>
      ```
    - **Royal Blue Signature Sections:**
      ```tsx
      <SectionTag className="bg-blue-600 dark:bg-blue-400 text-white">
        {TAG_TEXT}
      </SectionTag>
      ```
  - **Strict Ban on Pill Badges for Section Kickers:** NEVER use rounded-full pill capsules with background pills (`px-3.5 py-1.5 rounded-full bg-primary/10 border`) and circular dots (`w-1.5 h-1.5 rounded-full`) as section header kickers.

# Animation Standards (GSAP Exclusively)

- **Strict Ban on Framer Motion:** `framer-motion` is strictly forbidden and must NOT be added or imported anywhere in the project.
- **GSAP Foundation:** All animations must use `gsap`, `ScrollTrigger`, and `useGSAP` imported exclusively from `@/lib/gsap`.
- **Accessibility First:** Always guard animations with `if (isReducedMotion()) return;`.
- **Component Level:** Push animations to the leaf client components (`"use client"`). Always provide proper cleanup via `useGSAP` scoping (`{ scope: containerRef }`).

# Header & Navigation Architecture

- **Clean Brand Presentation:** NEVER place badges, subtext pills, or extraneous labels next to the Study With Asma logo. The cap logo and wordmark must stand clean and prestigious.
- **Strict Single-Line Guarantee:** The desktop floating navbar must remain on one single line across all desktop viewports (`whitespace-nowrap shrink-0`).
- **Grouped Dropdowns:** Do not crowd top-level links. Group related pages into clean dropdown menus:
  - `Home` (`/`)
  - `IELTS Prep` ▾ (Overview `/ielts`, All Courses `/courses`, Free Level Test `/level-test`)
  - `Study Abroad` ▾ (Advisory Overview `/study-abroad`, France `/destinations/france`, Italy `/destinations/italy`, Compare `/destinations`)
  - `About Asma` (`/about`)
  - `Resources` (`/resources`)
  - `Contact` (`/contact`)
- **Mobile Drawer:** Must include collapsible accordion toggles for dropdown items so mobile users have quick access to nested pages.

# Destination Scope Constraint

- **France & Italy Exclusively:** Study abroad services are currently restricted to **France 🇫🇷** and **Italy 🇮🇹** only. Do not add or reference other destinations (UK, Canada, Germany, etc.) on the public pages unless explicitly requested by the user.

# Copywriting & Anti-AI Text Bloat Rules

- **Zero Tolerance for AI-Generated Verbosity:** NEVER output dense paragraphs, academic essay blocks, or wordy fluff on public marketing and landing pages.
- **Card Descriptions:** Strict limit of 8 to 14 words per card. Single punchy sentence only.
- **Headlines & Subtitles:** Headlines must be 4 to 7 words. Subtitles must be a single concise sentence (10 to 16 words max). Do not place boilerplate descriptions under every headline if the visual context already conveys it.
- **Tone & Voice:** Active, confident, and direct ("Prepare for IELTS", "Secure DSU €7,000 yearly grants", "1-on-1 embassy mock interviews"). Avoid buzzwords like "unparalleled pedagogical methodology", "holistic horizons", "empowering your educational symphony".
- **Generous Whitespace & Breathing Room:** Let high-quality typography, pastel badges, and photography carry the design. Never clutter clean cards with multi-bullet paragraph lists.

# Page Layout Standards (Porbe Architecture)

- **Home Page (`/`):**
  - Hero with dashed orbital ring, tilted student photos, 6 floating badges, headline, amber button (`Register Now →`), and dark quick-pathway selector.
  - 6-card soft grid for services with pastel icon circles and `Read More →`.
  - Signature Royal Blue impact section with white text, amber button, circular stat badges (`500+`, `98%`), and overlapping student photos.
  - 5-stage alternating timeline (`01 Search`, `02 Compare`, `03 Engage`, `04 Apply`, `05 Go Abroad`) with connecting dotted line, followed by wide media photo with central play action.
  - Horizontal destination cards (`001 France`, `002 Italy`).
  - Founder Quote banner with Asma's circular portrait and amber button.
  - 4 circular stat badges (`Band 7.5+`, `98%`, `500+`, `€0 Tuition`).
  - Royal blue blog section with 1 large article and 2 stacked cards.
  - 2-column clean card FAQ grid.
  - Closing CTA banner with floating circular student portraits and amber button.

- **About Us Page (`/about`):**
  - Hero with 2-column header (Headline on left, 2-line intro on right) + 4-photo mosaic gallery (1 tall photo on left, 3 stacked photos on right).
  - 3-column milestone timeline (`2016`, `2020`, `2024`) with upward arrows `↑`.
  - 4 circular stat badges (`Band 7.5+`, `98%`, `500+`, `€0 Tuition`).
  - Signature Royal Blue block with 3 pill tabs (`Our Mission`, `Our Vision`, `Our Goals`) and clean white photo/content card inside.
  - Single-column FAQ accordion.
  - Closing CTA banner with floating circular student portraits and amber button.

- **Contact Us Page (`/contact`):**
  - Centered `Get In Touch` header.
  - Floating soft card with first/last name, email, phone number, message textarea, and dark `Submit Now` pill button.
  - Single-column FAQ accordion.
  - Closing CTA banner with floating circular student portraits and amber button.
