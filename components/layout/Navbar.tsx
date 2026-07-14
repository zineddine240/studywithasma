import Link from 'next/link';
import { GraduationCap } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full bg-[#FFFFFF]/95 backdrop-blur-sm border-b border-[#E5E7EB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="bg-[#EDE9FE] p-2.5 rounded-xl group-hover:bg-[#7C3AED] transition-colors">
              <GraduationCap className="w-6 h-6 text-[#7C3AED] group-hover:text-white transition-colors" />
            </div>
            <span className="font-bold text-xl sm:text-2xl text-[#1E1B4B] tracking-tight">
              Study with Asma
            </span>
          </Link>
          <div className="hidden md:flex space-x-8">
            <Link href="/" className="text-[#64748B] hover:text-[#7C3AED] font-medium transition-colors">Home</Link>
            <Link href="/courses" className="text-[#64748B] hover:text-[#7C3AED] font-medium transition-colors">Courses</Link>
            <Link href="#about" className="text-[#64748B] hover:text-[#7C3AED] font-medium transition-colors">About</Link>
            <Link href="#contact" className="text-[#64748B] hover:text-[#7C3AED] font-medium transition-colors">Contact</Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/login" className="hidden sm:inline-flex text-[#64748B] hover:text-[#7C3AED] font-medium transition-colors">Login</Link>
            <Link href="/request-access" className="bg-[#7C3AED] text-[#FFFFFF] px-6 py-2.5 rounded-full font-medium hover:bg-[#4C1D95] transition-colors shadow-sm">
              Request Access
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

