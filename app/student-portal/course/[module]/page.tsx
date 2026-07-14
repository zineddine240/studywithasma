import { Construction, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function ModuleComingSoonPage({ params }: { params: Promise<{ module: string }> }) {
  const resolvedParams = await params;
  const moduleName = resolvedParams.module.charAt(0).toUpperCase() + resolvedParams.module.slice(1);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="w-20 h-20 bg-[#EDE9FE] rounded-full flex items-center justify-center mb-6">
        <Construction className="w-10 h-10 text-[#7C3AED]" />
      </div>
      <h1 className="text-3xl font-extrabold text-[#1E1B4B] mb-4">
        {moduleName} Module
      </h1>
      <p className="text-[#64748B] max-w-md mx-auto mb-8 leading-relaxed">
        This module's detailed view is currently under development. Please check back later!
      </p>
      
      <Link
        href="/student-portal/course"
        className="inline-flex items-center gap-2 bg-[#FAF7FF] text-[#7C3AED] px-6 py-3 rounded-full font-bold border border-[#EDE9FE] hover:bg-[#EDE9FE] transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to My Course
      </Link>
    </div>
  );
}
