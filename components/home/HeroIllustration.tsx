"use client";

import {
  Headphones,
  BookText,
  PenTool,
  Mic,
  Video,
  Laptop,
  GraduationCap,
} from "lucide-react";

export default function HeroIllustration() {
  return (
    <div className="relative">
      {/* Decorative background shapes — absolute only for these */}
      <div className="absolute -top-8 -right-8 w-40 h-40 bg-[#EDE9FE] rounded-full blur-3xl opacity-50 -z-10" />
      <div className="absolute -bottom-6 -left-6 w-48 h-48 bg-purple-100 rounded-full blur-3xl opacity-40 -z-10" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] rounded-full bg-[radial-gradient(circle,_#FAF7FF_0%,_transparent_70%)] -z-10" />

      {/* Main two-column grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-5">
        {/* ── Left column: Teacher + Progress ── */}
        <div className="flex flex-col gap-4 lg:gap-5">
          {/* Teacher card */}
          <div className="bg-white rounded-2xl shadow-sm border border-[#EDE9FE] p-5">
            <div className="relative bg-[#FAF7FF] rounded-2xl h-48 flex flex-col items-center justify-end overflow-hidden mb-4">
              {/* Teacher figure — positioned behind the desk */}
              <div className="relative z-10 flex flex-col items-center mb-[-2px]">
                {/* Head */}
                <div className="w-14 h-14 rounded-full bg-gradient-to-b from-[#C4B5FD] to-[#A78BFA] border-[3px] border-white shadow-md flex items-center justify-center">
                  <GraduationCap className="w-7 h-7 text-[#4C1D95]" />
                </div>
                {/* Shoulders / upper body */}
                <div className="w-28 h-14 bg-[#7C3AED] rounded-t-[2rem] mt-[-2px]" />
              </div>

              {/* Desk surface — in front of teacher */}
              <div className="relative z-20 w-full">
                <div className="h-12 bg-[#EDE9FE] rounded-t-xl flex items-center justify-center">
                  {/* Laptop on desk */}
                  <div className="flex flex-col items-center mt-[-18px]">
                    <div className="bg-[#4C1D95] w-14 h-9 rounded-t-lg flex items-center justify-center">
                      <div className="w-10 h-6 bg-[#7C3AED] rounded-sm flex items-center justify-center">
                        <Laptop className="w-4 h-4 text-white opacity-70" />
                      </div>
                    </div>
                    <div className="bg-[#64748B] w-18 h-1 rounded-b-sm" style={{ width: '72px' }} />
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center">
              <p className="font-bold text-[#1E1B4B] text-sm">
                Asma — IELTS Instructor
              </p>
              <p className="text-xs text-[#64748B] mt-1">
                Academic &amp; General IELTS
              </p>
            </div>
          </div>

          {/* Progress card */}
          <div className="bg-white rounded-2xl shadow-sm border border-[#EDE9FE] p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-semibold text-[#1E1B4B]">
                Your Progress
              </p>
              <span className="text-sm font-bold text-[#7C3AED]">68%</span>
            </div>
            <div className="w-full h-2.5 bg-[#EDE9FE] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#7C3AED] to-[#A78BFA]"
                style={{ width: "68%" }}
              />
            </div>
            <p className="text-xs text-[#64748B] mt-2">
              17 of 25 lessons completed
            </p>
          </div>
        </div>

        {/* ── Right column: Live Class + Skills Grid ── */}
        <div className="flex flex-col gap-4 lg:gap-5">
          {/* Next Live Class card */}
          <div className="bg-white rounded-2xl shadow-sm border border-[#EDE9FE] p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-[#EDE9FE] flex items-center justify-center shrink-0">
                  <Video className="w-5 h-5 text-[#7C3AED]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#1E1B4B]">
                    Next Live Class
                  </p>
                  <p className="text-xs text-[#64748B]">
                    Speaking Practice
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 bg-red-50 px-2.5 py-1 rounded-full">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span className="text-[10px] font-bold text-red-600 uppercase">
                  Live
                </span>
              </div>
            </div>
            <p className="text-xs text-[#64748B] pl-11">Today, 6:00 PM</p>
          </div>

          {/* Skills 2×2 grid */}
          <div className="grid grid-cols-2 gap-3 lg:gap-4">
            {/* Listening */}
            <div className="bg-white rounded-2xl shadow-sm border border-[#EDE9FE] p-4 flex flex-col items-center text-center gap-2.5 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-[#EDE9FE] flex items-center justify-center">
                <Headphones className="w-5 h-5 text-[#7C3AED]" />
              </div>
              <span className="text-sm font-semibold text-[#1E1B4B]">
                Listening
              </span>
            </div>

            {/* Reading */}
            <div className="bg-white rounded-2xl shadow-sm border border-[#EDE9FE] p-4 flex flex-col items-center text-center gap-2.5 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-[#EDE9FE] flex items-center justify-center">
                <BookText className="w-5 h-5 text-[#7C3AED]" />
              </div>
              <span className="text-sm font-semibold text-[#1E1B4B]">
                Reading
              </span>
            </div>

            {/* Writing — with feedback badge */}
            <div className="bg-white rounded-2xl shadow-sm border border-[#EDE9FE] p-4 flex flex-col items-center text-center gap-2.5 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-[#EDE9FE] flex items-center justify-center">
                <PenTool className="w-5 h-5 text-[#7C3AED]" />
              </div>
              <span className="text-sm font-semibold text-[#1E1B4B]">
                Writing
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                Feedback ready
              </span>
            </div>

            {/* Speaking */}
            <div className="bg-white rounded-2xl shadow-sm border border-[#EDE9FE] p-4 flex flex-col items-center text-center gap-2.5 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-[#EDE9FE] flex items-center justify-center">
                <Mic className="w-5 h-5 text-[#7C3AED]" />
              </div>
              <span className="text-sm font-semibold text-[#1E1B4B]">
                Speaking
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
