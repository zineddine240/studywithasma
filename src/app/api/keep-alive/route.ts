import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "@/utils/env";

/**
 * GET /api/keep-alive
 *
 * Lightweight ping endpoint that performs a minimal Supabase query to prevent
 * the free-tier project from being paused due to 7 days of inactivity.
 *
 * Triggered automatically by a Vercel Cron Job every 3 days (see vercel.json).
 * Can also be called manually if needed.
 */
export async function GET(request: Request) {
  // Validate the cron secret to prevent unauthorized calls in production
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Use a lightweight anon client — no cookies needed for a simple ping
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    // Minimal query: just select 1 row from any public table.
    // Using `rpc` with a simple SELECT 1 is the cheapest possible operation.
    const { error } = await supabase.rpc("ping");

    // If the RPC doesn't exist yet, fall back to a table query
    if (error && error.code === "PGRST202") {
      // Fallback: query a known small table — just fetching count from system
      const { error: fallbackError } = await supabase
        .from("courses") // replace with any table that exists in your schema
        .select("id", { count: "exact", head: true });

      if (fallbackError) throw fallbackError;
    } else if (error) {
      throw error;
    }

    return NextResponse.json({
      ok: true,
      message: "Supabase keep-alive ping successful",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[keep-alive] Supabase ping failed:", error);
    return NextResponse.json(
      {
        ok: false,
        message: "Supabase ping failed",
        error: error instanceof Error ? error.message : String(error),
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
