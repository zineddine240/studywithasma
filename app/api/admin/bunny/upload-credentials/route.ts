import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import crypto from "crypto";

export const runtime = "nodejs";

export async function POST(req: Request) {
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

    // 2. Parse Request
    const body = await req.json();
    const title = body.title || "Untitled Video";
    const collectionId = body.collectionId; // Optional

    // 3. Load Environment Variables
    const libraryId = process.env.BUNNY_STREAM_LIBRARY_ID;
    const apiKey = process.env.BUNNY_STREAM_API_KEY;

    if (!libraryId || !apiKey) {
      return NextResponse.json(
        { error: "Bunny Stream is not configured on the server." },
        { status: 500 }
      );
    }

    // 4. Create Video Object on Bunny Stream
    const createRes = await fetch(`https://video.bunnycdn.com/library/${libraryId}/videos`, {
      method: "POST",
      headers: {
        "AccessKey": apiKey,
        "Accept": "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        title,
        collectionId: collectionId || undefined
      })
    });

    if (!createRes.ok) {
      const errorData = await createRes.text();
      console.error("Bunny API Error:", errorData);
      return NextResponse.json({ error: "Failed to create video object in Bunny Stream" }, { status: 500 });
    }

    const videoData = await createRes.json();
    const videoId = videoData.guid;

    if (!videoId) {
      return NextResponse.json({ error: "Invalid response from Bunny API" }, { status: 500 });
    }

    // 5. Generate Upload Signature (TUS)
    // Expiration time: current time + 24 hours (in seconds)
    const expirationTime = Math.floor(Date.now() / 1000) + 24 * 60 * 60;
    
    // Formula: SHA256(libraryId + apiKey + expirationTime + videoId)
    const signatureString = `${libraryId}${apiKey}${expirationTime}${videoId}`;
    const authorizationSignature = crypto.createHash("sha256").update(signatureString).digest("hex");

    // 6. Return Safe Upload Credentials (NEVER RETURN THE API KEY)
    return NextResponse.json({
      videoId,
      libraryId,
      expirationTime,
      authorizationSignature,
      uploadEndpoint: "https://video.bunnycdn.com/tusupload"
    });

  } catch (error: any) {
    console.error("Upload Credentials Error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
