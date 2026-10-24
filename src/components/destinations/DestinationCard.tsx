import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Clock, GraduationCap, MapPin, Sparkles } from "lucide-react";
import type { Destination } from "@/lib/destinationData";
import { FranceFlag, ItalyFlag } from "@/components/home/hero/CountryFlags";

const FLAG_MAP: Record<string, React.FC<{ className?: string }>> = {
  france: FranceFlag,
  italy: ItalyFlag,
};

interface DestinationCardProps {
  destination: Destination;
  index: number;
}

export default function DestinationCard({ destination, index }: DestinationCardProps) {
  const numberStr = String(index + 1).padStart(3, "0");
  const FlagComponent = FLAG_MAP[destination.slug];

  return (
    <div className="group bg-card rounded-3xl border border-border/80 hover:border-primary/40 shadow-xs hover:shadow-xl transition-all duration-300 p-6 sm:p-8 flex flex-col md:flex-row items-center gap-6 sm:gap-8 overflow-hidden relative">
      
      {/* Left: Numbering & Country Identity */}
      <div className="w-full md:w-1/4 space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-bold tracking-widest uppercase border border-border">
          <span>{numberStr}</span>
          {FlagComponent ? (
            <FlagComponent className="w-5 h-5" />
          ) : (
            <span className="text-base">{destination.flag}</span>
          )}
          <span className="text-[11px] font-mono font-semibold text-muted-foreground">{destination.shortName}</span>
        </div>
        
        <h3 className="text-2xl sm:text-3xl font-serif font-extrabold text-foreground group-hover:text-primary transition-colors">
          {destination.name}
        </h3>
        
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          {destination.popularFor}
        </p>
      </div>

      {/* Middle: Angled / Refined Image Card */}
      <div className="w-full md:w-2/5 flex items-center justify-center">
        <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] rounded-2xl overflow-hidden shadow-md group-hover:shadow-xl group-hover:scale-[1.02] transition-all duration-300 border border-border">
          <Image
            src={destination.cardImage}
            alt={`Studying in ${destination.name}`}
            fill
            sizes="(max-width: 768px) 100vw, 30vw"
            className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-linear-to-t from-slate-950/60 via-transparent to-transparent" />
          
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
            <span className="font-semibold bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-md border border-white/20">
              {destination.stats.intakeMonths}
            </span>
            <span className="font-semibold bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-md border border-white/20">
              {destination.stats.postStudyWork}
            </span>
          </div>
        </div>
      </div>

      {/* Right: Key Details & CTA */}
      <div className="w-full md:w-1/3 space-y-4 text-left">
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
          {destination.tagline}
        </p>

        <div className="space-y-1.5 text-xs text-foreground/90 pt-1">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <span className="font-semibold text-foreground">Tuition:</span>
            <span>{destination.stats.avgTuition}</span>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <span className="font-semibold text-foreground">Work Visa:</span>
            <span>{destination.stats.postStudyWork}</span>
          </div>
        </div>

        <div className="pt-2">
          <Link
            href={`/destinations/${destination.slug}`}
            className="inline-flex items-center gap-2 text-sm font-bold text-primary group-hover:text-primary/80 transition-colors"
          >
            <span>Read More</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
          </Link>
        </div>
      </div>

    </div>
  );
}
