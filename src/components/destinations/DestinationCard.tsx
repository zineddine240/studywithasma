import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Clock,
  GraduationCap,
  MapPin,
  Sparkles,
} from "lucide-react";
import type { Destination } from "@/lib/destinationData";
import {
  FranceFlag,
  ItalyFlag,
  NetherlandsFlag,
  PolandFlag,
} from "@/components/ui/CountryFlags";

const FLAG_MAP: Record<string, React.FC<{ className?: string }>> = {
  france: FranceFlag,
  italy: ItalyFlag,
  netherlands: NetherlandsFlag,
  poland: PolandFlag,
};

interface DestinationCardProps {
  destination: Destination;
  index: number;
}

export default function DestinationCard({
  destination,
  index,
}: DestinationCardProps) {
  const numberStr = String(index + 1).padStart(3, "0");
  const FlagComponent = FLAG_MAP[destination.slug];

  return (
    <div className="group bg-white rounded-3xl border border-slate-200/80 hover:border-indigo-300 shadow-2xs hover:shadow-md transition-all duration-300 p-6 sm:p-8 flex flex-col md:flex-row items-center gap-6 sm:gap-8 overflow-hidden relative">
      {/* Left: Numbering & Country Identity */}
      <div className="w-full md:w-1/4 space-y-2.5">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-800 text-xs font-bold tracking-widest uppercase border border-slate-200/80">
          <span className="font-mono text-slate-900">{numberStr}</span>
          {FlagComponent ? (
            <FlagComponent className="w-5 h-5 shrink-0" />
          ) : (
            <span className="text-base">{destination.flag}</span>
          )}
          <span className="text-[11px] font-mono font-semibold text-slate-500">
            {destination.shortName}
          </span>
        </div>

        <h3 className="text-2xl sm:text-3xl font-extrabold text-[#0B1536] tracking-tight group-hover:text-indigo-600 transition-colors">
          {destination.name}
        </h3>

        <p className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
          {destination.popularFor}
        </p>
      </div>

      {/* Middle: Angled / Refined Image Card */}
      <div className="w-full md:w-2/5 flex items-center justify-center">
        <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] rounded-2xl overflow-hidden shadow-xs group-hover:shadow-md group-hover:scale-[1.02] transition-all duration-300 border border-slate-200/80 bg-slate-100">
          <Image
            src={destination.cardImage}
            alt={`Studying in ${destination.name}`}
            fill
            sizes="(max-width: 768px) 100vw, 30vw"
            className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-linear-to-t from-slate-950/60 via-transparent to-transparent" />

          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
            <span className="font-semibold bg-slate-950/70 backdrop-blur-md px-2.5 py-1 rounded-md border border-white/20">
              {destination.stats.intakeMonths}
            </span>
            <span className="font-semibold bg-slate-950/70 backdrop-blur-md px-2.5 py-1 rounded-md border border-white/20">
              {destination.stats.postStudyWork}
            </span>
          </div>
        </div>
      </div>

      {/* Right: Key Details & CTA */}
      <div className="w-full md:w-1/3 space-y-4 text-left">
        <p className="text-sm text-slate-600 leading-relaxed line-clamp-3">
          {destination.tagline}
        </p>

        <div className="space-y-1.5 text-xs text-slate-700 pt-1">
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-slate-900">Tuition:</span>
            <span className="text-slate-600">
              {destination.stats.avgTuition}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-slate-900">Work Visa:</span>
            <span className="text-slate-600">
              {destination.stats.postStudyWork}
            </span>
          </div>
        </div>

        <div className="pt-2">
          <Link
            href={`/destinations/${destination.slug}`}
            className="inline-flex items-center gap-2 text-sm font-bold text-indigo-600 hover:text-indigo-700 group-hover:gap-3 transition-all duration-150"
          >
            <span>Read More</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </Link>
        </div>
      </div>
    </div>
  );
}
