import React from "react";
import { getBunnyEmbedUrl } from "@/lib/utils/bunny";

interface BunnyVideoPlayerProps {
  libraryId: string;
  videoId: string;
  title?: string;
}

export function BunnyVideoPlayer({ libraryId, videoId, title = "Video Player" }: BunnyVideoPlayerProps) {
  const embedUrl = getBunnyEmbedUrl(libraryId, videoId);

  if (!libraryId || !videoId) {
    return (
      <div className="w-full aspect-video bg-slate-900 rounded-xl flex items-center justify-center text-slate-400">
        <p>Video is unavailable</p>
      </div>
    );
  }

  return (
    <div className="w-full aspect-video rounded-xl overflow-hidden bg-black shadow-lg border border-border">
      <iframe
        src={embedUrl}
        loading="lazy"
        title={title}
        style={{ border: "none", width: "100%", height: "100%" }}
        allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}
