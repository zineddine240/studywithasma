"use client";

export default function HeroIllustration() {
  return (
    <div className="relative w-full aspect-video rounded-3xl border border-white/10 bg-card overflow-hidden">
      {/* Autoplay ambient video */}
      <video
        src="/videos/video-ielts.mp4"
        autoPlay
        muted
        loop
        playsInline
        className="w-full h-full object-cover"
      />
      {/* Translucent overlay gradients to match the Liquid Glass style */}
      <div className="absolute inset-0 bg-linear-to-t from-background/40 via-transparent to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(161,98,7,0.05),transparent_60%)] pointer-events-none" />
    </div>
  );
}
