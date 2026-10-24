import { forwardRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Play } from "lucide-react";

export const ProcessMediaBanner = forwardRef<HTMLDivElement>((_, ref) => {
  return (
    <div
      ref={ref}
      className="relative w-full mx-auto rounded-3xl sm:rounded-4xl overflow-hidden shadow-2xl bg-slate-950"
    >
      <div className="relative aspect-16/9 sm:aspect-21/9">
        <Image
          src="https://images.unsplash.com/photo-1531545514256-b1400bc00f31?q=80&w=1200&auto=format&fit=crop"
          alt="Mentor coaching student on study abroad and IELTS preparation"
          fill
          sizes="(max-width: 1024px) 100vw, 896px"
          className="object-cover opacity-90"
        />
        {/* Subtle Gradient Overlay */}
        <div className="absolute inset-0 bg-slate-950/30" />

        {/* Central Amber Play/Action Button */}
        <Link
          href="/contact"
          className="absolute inset-0 m-auto w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-amber-400 hover:bg-amber-300 text-slate-950 flex items-center justify-center shadow-2xl transition-transform hover:scale-110 group"
          aria-label="Book an advisory consultation"
        >
          <Play className="w-7 h-7 sm:w-8 sm:h-8 fill-slate-950 ml-1 transition-transform group-hover:scale-105" />
        </Link>
      </div>
    </div>
  );
});

ProcessMediaBanner.displayName = "ProcessMediaBanner";
export default ProcessMediaBanner;
