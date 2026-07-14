import { Menu, Bell } from "lucide-react";
import { studentData } from "@/lib/mock/student-dashboard";

export function PortalTopBar({
  onOpenSidebar,
}: {
  onOpenSidebar: () => void;
}) {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-20 px-4 sm:px-6 lg:px-8 bg-white/95 backdrop-blur-sm border-b border-[#EDE9FE]">
      <div className="flex items-center gap-4">
        <button
          onClick={onOpenSidebar}
          className="lg:hidden p-2 text-[#64748B] hover:text-[#7C3AED] transition-colors rounded-lg hover:bg-[#FAF7FF]"
          aria-label="Open sidebar"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      <div className="flex items-center gap-4 sm:gap-6">
        <button className="relative p-2 text-[#64748B] hover:text-[#7C3AED] transition-colors rounded-full hover:bg-[#FAF7FF]" aria-label="Notifications">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
        </button>

        <div className="flex items-center gap-3 border-l border-[#EDE9FE] pl-4 sm:pl-6">
          <div className="hidden sm:block text-right">
            <p className="text-sm font-bold text-[#1E1B4B]">
              {studentData.name}
            </p>
            <p className="text-xs text-[#64748B]">Student</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-gradient-to-b from-[#C4B5FD] to-[#A78BFA] border-2 border-white shadow-sm flex items-center justify-center text-white font-bold text-sm">
            {studentData.name.charAt(0)}
          </div>
        </div>
      </div>
    </header>
  );
}
