import { PortalCard } from "../shared/PortalCard";
import { studentData } from "@/lib/mock/student-dashboard";

export function WelcomeCard() {
  return (
    <PortalCard className="bg-[#1E1B4B] text-white border-none relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#7C3AED] rounded-full blur-3xl opacity-30 -translate-y-1/2 translate-x-1/3"></div>
      
      <div className="relative z-10">
        <h1 className="text-2xl sm:text-3xl font-extrabold mb-2">
          Welcome back, {studentData.name.split(" ")[0]} 👋
        </h1>
        <p className="text-[#C4B5FD] text-sm sm:text-base mb-6">
          Continue your IELTS journey with Asma.
        </p>

        <div className="flex flex-wrap gap-3 sm:gap-6">
          <div className="bg-white/10 rounded-xl px-4 py-2 border border-white/10 backdrop-blur-sm">
            <p className="text-xs text-[#C4B5FD] mb-0.5 uppercase tracking-wider font-semibold">Course</p>
            <p className="font-bold text-sm">{studentData.course}</p>
          </div>
          <div className="bg-white/10 rounded-xl px-4 py-2 border border-white/10 backdrop-blur-sm">
            <p className="text-xs text-[#C4B5FD] mb-0.5 uppercase tracking-wider font-semibold">Group</p>
            <p className="font-bold text-sm">{studentData.group}</p>
          </div>
          <div className="bg-white/10 rounded-xl px-4 py-2 border border-white/10 backdrop-blur-sm">
            <p className="text-xs text-[#C4B5FD] mb-0.5 uppercase tracking-wider font-semibold">Target Band</p>
            <p className="font-bold text-sm">{studentData.targetBand}</p>
          </div>
        </div>
      </div>
    </PortalCard>
  );
}
