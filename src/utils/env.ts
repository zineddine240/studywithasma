/**
 * Centralized environment variable config.
 *
 * RULE: Never call `process.env.*` directly in business logic.
 * Always import from this file instead.
 *
 * - Server-only vars (no NEXT_PUBLIC_ prefix) are validated at import time
 *   and throw a clear error if missing, so misconfiguration is caught early.
 * - Public vars (NEXT_PUBLIC_*) are also re-exported here for consistency,
 *   but their presence is not hard-enforced (they are inlined by Next.js at build time).
 */

// ── Public (client-safe) ─────────────────────────────────────────────────────

export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

// ── Server-only ───────────────────────────────────────────────────────────────

function requireServerEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(
      `[env] Missing required server environment variable: "${key}". ` +
        `Check your .env.local file and Vercel project settings.`
    );
  }
  return value;
}

export const SUPABASE_SERVICE_ROLE_KEY = () =>
  requireServerEnv("SUPABASE_SERVICE_ROLE_KEY");

export const TELEGRAM_BOT_TOKEN = () =>
  requireServerEnv("TELEGRAM_BOT_TOKEN");

export const TELEGRAM_CHAT_ID = () =>
  requireServerEnv("TELEGRAM_CHAT_ID");

export const GEMINI_API_KEY = () =>
  requireServerEnv("GEMINI_API_KEY");
