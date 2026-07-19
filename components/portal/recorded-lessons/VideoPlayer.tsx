"use client";

interface VideoPlayerProps {
  videoUrl: string;
}

export function VideoPlayer({ videoUrl }: VideoPlayerProps) {
  // Helper to parse YouTube IDs
  function getYouTubeEmbedUrl(url: string) {
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    if (match && match[2].length === 11) {
      return `https://www.youtube.com/embed/${match[2]}?autoplay=0&rel=0&modestbranding=1`;
    }
    return null;
  }

  // Helper to parse Vimeo IDs
  function getVimeoEmbedUrl(url: string) {
    const regExp = /vimeo\.com\/(?:video\/)?([0-9]+)/;
    const match = url.match(regExp);
    if (match) {
      return `https://player.vimeo.com/video/${match[1]}?autoplay=0&dnt=1`;
    }
    return null;
  }

  const ytUrl = getYouTubeEmbedUrl(videoUrl);
  const vimeoUrl = getVimeoEmbedUrl(videoUrl);

  const embedUrl = ytUrl || vimeoUrl || videoUrl;

  return (
    <div className="relative w-full aspect-video bg-slate-950 rounded-2xl overflow-hidden shadow-lg border border-slate-900">
      {ytUrl ||
      vimeoUrl ||
      videoUrl.includes("embed") ||
      videoUrl.includes("bunny") ||
      videoUrl.includes("mediadelivery") ? (
        <iframe
          src={embedUrl}
          className="w-full h-full border-0 absolute inset-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
        ></iframe>
      ) : (
        <video
          src={videoUrl}
          controls
          className="w-full h-full object-contain"
          controlsList="nodownload"
          disablePictureInPicture
        >
          Your browser does not support playing this video.
        </video>
      )}
    </div>
  );
}
