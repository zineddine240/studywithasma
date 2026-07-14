import { PlayCircle } from "lucide-react";

export function VideoPlayerPlaceholder() {
  return (
    <div className="relative w-full aspect-video bg-slate-900 rounded-2xl overflow-hidden shadow-lg border border-slate-800 flex flex-col items-center justify-center group cursor-pointer">
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent z-10 pointer-events-none"></div>
      
      {/* Play Button */}
      <div className="relative z-20 w-16 h-16 sm:w-20 sm:h-20 bg-[#7C3AED]/90 rounded-full flex items-center justify-center backdrop-blur-sm group-hover:scale-110 group-hover:bg-[#7C3AED] transition-all shadow-xl">
        <PlayCircle className="w-8 h-8 sm:w-10 sm:h-10 text-white ml-1" />
      </div>
      
      <p className="relative z-20 mt-4 text-slate-300 font-medium text-sm sm:text-base">
        Mock Video Player
      </p>

      {/* Mock Controls Bar */}
      <div className="absolute bottom-0 left-0 right-0 p-4 z-20 flex items-center gap-4 opacity-50">
        <div className="w-3 h-3 rounded-full bg-white"></div>
        <div className="flex-grow h-1 bg-white/20 rounded-full overflow-hidden">
          <div className="w-1/3 h-full bg-[#7C3AED]"></div>
        </div>
        <div className="text-white text-xs font-medium">14:20 / 42:00</div>
      </div>
    </div>
  );
}
