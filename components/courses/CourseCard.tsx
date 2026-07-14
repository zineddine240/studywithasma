import Link from "next/link";
import {
  BookOpen,
  Headphones,
  BookText,
  PenTool,
  Mic,
  Video,
  PlayCircle,
  FileText,
  MessageSquare,
  BarChart3,
  ArrowRight,
} from "lucide-react";

interface CourseCardProps {
  slug: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  modules: { name: string; icon: React.ReactNode }[];
  features: { label: string; icon: React.ReactNode }[];
}

export default function CourseCard({
  slug,
  title,
  description,
  icon,
  modules,
  features,
}: CourseCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-[#EDE9FE] shadow-sm hover:shadow-lg transition-shadow overflow-hidden flex flex-col">
      {/* Header */}
      <div className="bg-[#FAF7FF] p-6 sm:p-8 border-b border-[#EDE9FE]">
        <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-[#E5E7EB] mb-5">
          {icon}
        </div>
        <h3 className="text-2xl font-bold text-[#1E1B4B] mb-3">{title}</h3>
        <p className="text-[#64748B] leading-relaxed">{description}</p>
      </div>

      {/* Body */}
      <div className="p-6 sm:p-8 flex-grow flex flex-col">
        {/* Modules */}
        <div className="mb-8">
          <h4 className="text-sm font-semibold text-[#1E1B4B] uppercase tracking-wider mb-4">
            Course Modules
          </h4>
          <ul className="space-y-2.5">
            {modules.map((mod, i) => (
              <li
                key={i}
                className="flex items-center gap-3 text-[#1E1B4B] font-medium bg-[#FAF7FF] px-4 py-3 rounded-xl border border-[#EDE9FE]"
              >
                <span className="text-[#7C3AED]">{mod.icon}</span>
                <span className="text-sm">
                  Module {i + 1}: {mod.name}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Features */}
        <div className="mb-8">
          <h4 className="text-sm font-semibold text-[#1E1B4B] uppercase tracking-wider mb-4">
            What You Get
          </h4>
          <ul className="space-y-3">
            {features.map((feat, i) => (
              <li key={i} className="flex items-center gap-3 text-[#64748B]">
                <span className="text-[#7C3AED]">{feat.icon}</span>
                <span className="text-sm">{feat.label}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Buttons — pushed to bottom */}
        <div className="mt-auto flex flex-col sm:flex-row gap-3">
          <Link
            href={`/courses/${slug}`}
            className="flex-1 bg-[#7C3AED] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#4C1D95] transition-colors text-center text-sm flex items-center justify-center gap-2 shadow-sm"
          >
            View Course
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href={`/request-access?course=${slug}`}
            className="flex-1 bg-white text-[#1E1B4B] border border-[#E5E7EB] px-6 py-3 rounded-full font-semibold hover:bg-[#EDE9FE] hover:border-[#EDE9FE] transition-colors text-center text-sm"
          >
            Request Access
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ── Mock data helper ── */

export function getCoursesData(): CourseCardProps[] {
  return [
    {
      slug: "academic-ielts",
      title: "Academic IELTS",
      description:
        "Prepare for university and academic purposes through structured lessons in Listening, Reading, Writing, and Speaking.",
      icon: <BookOpen className="w-7 h-7 text-[#7C3AED]" />,
      modules: [
        { name: "Introduction", icon: <BookOpen className="w-4 h-4" /> },
        { name: "Listening", icon: <Headphones className="w-4 h-4" /> },
        { name: "Reading", icon: <BookText className="w-4 h-4" /> },
        { name: "Writing", icon: <PenTool className="w-4 h-4" /> },
        { name: "Speaking", icon: <Mic className="w-4 h-4" /> },
      ],
      features: [
        { label: "Live online classes", icon: <Video className="w-4 h-4" /> },
        {
          label: "Recorded lessons",
          icon: <PlayCircle className="w-4 h-4" />,
        },
        { label: "PDF materials", icon: <FileText className="w-4 h-4" /> },
        {
          label: "Homework and teacher feedback",
          icon: <MessageSquare className="w-4 h-4" />,
        },
        {
          label: "Personal progress tracking",
          icon: <BarChart3 className="w-4 h-4" />,
        },
      ],
    },
    {
      slug: "general-ielts",
      title: "General IELTS",
      description:
        "Prepare for work, migration, and everyday English communication through practical IELTS training.",
      icon: <BookText className="w-7 h-7 text-[#7C3AED]" />,
      modules: [
        { name: "Introduction", icon: <BookOpen className="w-4 h-4" /> },
        { name: "Listening", icon: <Headphones className="w-4 h-4" /> },
        { name: "Reading", icon: <BookText className="w-4 h-4" /> },
        { name: "Writing", icon: <PenTool className="w-4 h-4" /> },
        { name: "Speaking", icon: <Mic className="w-4 h-4" /> },
      ],
      features: [
        { label: "Live online classes", icon: <Video className="w-4 h-4" /> },
        {
          label: "Recorded lessons",
          icon: <PlayCircle className="w-4 h-4" />,
        },
        { label: "PDF materials", icon: <FileText className="w-4 h-4" /> },
        {
          label: "Homework and teacher feedback",
          icon: <MessageSquare className="w-4 h-4" />,
        },
        {
          label: "Personal progress tracking",
          icon: <BarChart3 className="w-4 h-4" />,
        },
      ],
    },
  ];
}
