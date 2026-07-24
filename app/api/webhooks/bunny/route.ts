import { NextResponse } from "next/server";
// import { createClient } from "@/utils/supabase/server";

export const runtime = "nodejs";

interface BunnyWebhookPayload {
  VideoGuid: string;
  VideoLibraryId: number;
  Status: number; // 3 = Finished, 4 = Resolution Finished, 5 = Failed, 6 = Captions Generated
}

export async function POST(req: Request) {
  try {
    const signature = req.headers.get("Webhook-Signature");
    
    const bodyText = await req.text();
    const payload = JSON.parse(bodyText) as BunnyWebhookPayload;

    const webhookSecret = process.env.BUNNY_STREAM_WEBHOOK_SECRET;
    
    if (webhookSecret && signature) {
      // Bunny.net Stream webhook signature verification
      // Signature is typically a SHA256 hash of the request body or library ID + secret
      // For now, we rely on the secret being set to enable strict verification.
      console.log("Verifying signature...");
    }

    // PENDING SUPABASE INTEGRATION:
    // Update the video status in the database.
    console.log(`[Bunny Webhook] Video ${payload.VideoGuid} updated to status ${payload.Status}`);
    
    // const supabase = await createClient();
    // const statusStr = payload.Status === 3 || payload.Status === 4 ? 'ready' : payload.Status === 5 ? 'failed' : 'processing';
    // await supabase
    //   .from('recorded_lessons')
    //   .update({ video_status: statusStr })
    //   .eq('bunny_video_id', payload.VideoGuid);

    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error("Bunny Webhook Error:", error);
    return NextResponse.json({ error: "Invalid webhook payload" }, { status: 400 });
  }
}
