import { ArrowRight, Sparkles } from "lucide-react";
import HeroIllustration from "./HeroIllustration";

export default function HeroSection() {
  return (
    <section className="relative bg-white py-16 sm:py-20 lg:py-24 overflow-hidden">
      {/* Very subtle background tint */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_60%_40%,_#FAF7FF_0%,_transparent_70%)] -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* ── Left: Text content ── */}
          <div className="relative z-10">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#EDE9FE] text-[#7C3AED] text-sm font-semibold mb-8">
              <Sparkles className="w-4 h-4" />
              Online IELTS Preparation
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] xl:text-6xl font-extrabold text-[#1E1B4B] leading-[1.1] mb-6 tracking-tight">
              Master IELTS with{" "}
              <span className="text-[#7C3AED]">Confidence</span>
            </h1>

            <p className="text-lg sm:text-xl text-[#64748B] mb-10 leading-relaxed max-w-lg">
              Learn IELTS Academic and General with Asma through structured
              lessons, recorded sessions, and personal guidance.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="#contact"
                className="bg-[#7C3AED] text-white px-8 py-4 rounded-full font-semibold hover:bg-[#4C1D95] transition-all flex items-center justify-center gap-2 shadow-lg shadow-purple-500/20"
              >
                Start Learning
                <ArrowRight className="w-5 h-5" />
              </a>
              <a
                href="/courses"
                className="bg-white text-[#1E1B4B] border border-[#E5E7EB] px-8 py-4 rounded-full font-semibold hover:bg-[#EDE9FE] hover:border-[#EDE9FE] transition-all flex items-center justify-center shadow-sm"
              >
                Explore Courses
              </a>
            </div>
          </div>

          {/* ── Right: Illustration ── */}
          <div className="relative lg:ml-4">
            <HeroIllustration />
          </div>
        </div>
      </div>
    </section>
  );
}
