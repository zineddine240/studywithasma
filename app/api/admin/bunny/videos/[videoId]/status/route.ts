import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export const runtime = "nodejs";

export async function GET(req: Request, { params }: { params: Promise<{ videoId: string }> }) {
  try {
    // 1. Verify Admin Authorization
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role !== "admin" && profile?.role !== "teacher") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { videoId } = await params; // Next 15

    // 2. Load Environment Variables
    const libraryId = process.env.BUNNY_STREAM_LIBRARY_ID;
    const apiKey = process.env.BUNNY_STREAM_API_KEY;

    if (!libraryId || !apiKey) {
      return NextResponse.json(
        { error: "Bunny Stream is not configured." },
        { status: 500 }
      );
    }

    // 3. Get Video Status from Bunny API
    const res = await fetch(`https://video.bunnycdn.com/library/${libraryId}/videos/${videoId}`, {
      method: "GET",
      headers: {
        "AccessKey": apiKey,
        "Accept": "application/json"
      }
    });

    if (!res.ok) {
      return NextResponse.json({ error: "Failed to fetch video status" }, { status: res.status });
    }

    const videoData = await res.json();

    // 4. Return Safe Metadata
    return NextResponse.json({
      status: videoData.status, // e.g., 0 = Queued, 1 = Processing, 2 = Encoding, 3 = Finished, 4 = Resolution Finished, 5 = Failed
      encodeProgress: videoData.encodeProgress,
      duration: videoData.length,
      thumbnailUrl: `https://vz-${libraryId}.b-cdn.net/${videoId}/thumbnail.jpg`,
    });

  } catch (error: any) {
    console.error("Video Status Error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
