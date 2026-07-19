import { Construction, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function ModuleComingSoonPage({ params }: { params: Promise<{ module: string }> }) {
  const resolvedParams = await params;
  const moduleName = resolvedParams.module.charAt(0).toUpperCase() + resolvedParams.module.slice(1);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mb-6">
        <Construction className="w-10 h-10 text-primary" />
      </div>
      <h1 className="text-3xl font-extrabold text-foreground mb-4">
        {moduleName} Module
      </h1>
      <p className="text-muted-foreground max-w-md mx-auto mb-8 leading-relaxed">
        This module's detailed view is currently under development. Please check back later!
      </p>
      
      <Link
        href="/student-portal/course"
        className="inline-flex items-center gap-2 bg-muted/30 text-primary px-6 py-3 rounded-full font-bold border border-border hover:bg-secondary transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to My Course
      </Link>
    </div>
  );
}
