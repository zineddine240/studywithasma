import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Headphones,
  BookText,
  PenTool,
  Mic,
  Video,
  PlayCircle,
  FileText,
  ClipboardList,
  MessageSquare,
  BarChart3,
  MonitorSmartphone,
  Users,
  Layers,
  UserCheck,
  CheckCircle,
} from "lucide-react";
import type { CourseDetail } from "@/lib/courseData";

const moduleIcons: Record<string, React.ReactNode> = {
  Introduction: <BookOpen className="w-5 h-5 text-primary" />,
  Listening: <Headphones className="w-5 h-5 text-primary" />,
  Reading: <BookText className="w-5 h-5 text-primary" />,
  Writing: <PenTool className="w-5 h-5 text-primary" />,
  Speaking: <Mic className="w-5 h-5 text-primary" />,
};

const featureIcons: Record<string, React.ReactNode> = {
  "Live online classes": <Video className="w-5 h-5 text-primary" />,
  "Recorded lessons": <PlayCircle className="w-5 h-5 text-primary" />,
  "PDF materials": <FileText className="w-5 h-5 text-primary" />,
  Homework: <ClipboardList className="w-5 h-5 text-primary" />,
  "Teacher feedback": <MessageSquare className="w-5 h-5 text-primary" />,
  "Progress tracking": <BarChart3 className="w-5 h-5 text-primary" />,
};

const formatIcons: Record<string, React.ReactNode> = {
  "Zoom or Google Meet classes": (
    <MonitorSmartphone className="w-5 h-5 text-primary" />
  ),
  "Recorded sessions": <PlayCircle className="w-5 h-5 text-primary" />,
  "Structured modules": <Layers className="w-5 h-5 text-primary" />,
  "Personal guidance from Asma": (
    <UserCheck className="w-5 h-5 text-primary" />
  ),
};

interface CourseDetailPageContentProps {
  course: CourseDetail;
}

export default function CourseDetailPageContent({
  course,
}: CourseDetailPageContentProps) {
  const totalLessons = course.modules.reduce(
    (sum, m) => sum + m.lessonCount,
    0,
  );

  return (
    <main className="grow">
      {/* ── Course Hero ── */}
      <section className="bg-muted/30 py-14 sm:py-20 border-b border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/courses"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Courses
          </Link>

          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-secondary text-primary">
              <Users className="w-3.5 h-3.5" />
              {course.badge}
            </span>
            <span className="text-sm text-muted-foreground">
              {course.modules.length} Modules · {totalLessons} Lessons
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground mb-4 tracking-tight">
            {course.title}
          </h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl leading-relaxed">
            {course.shortDescription}
          </p>

          <Link
            href={`/request-access?course=${course.slug}`}
            className="inline-flex items-center gap-2 bg-primary text-white px-8 py-3.5 rounded-full font-semibold hover:bg-primary/80 transition-colors shadow-sm"
          >
            Request Access
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* ── Who This Course Is For ── */}
      <section className="py-14 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground mb-4">
            Who This Course Is For
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            {course.whoIsItFor}
          </p>
        </div>
      </section>

      {/* ── Course Modules ── */}
      <section className="py-14 sm:py-16 bg-muted/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground mb-8">
            Course Modules
          </h2>
          <div className="space-y-4">
            {course.modules.map((mod) => (
              <div
                key={mod.number}
                className="bg-card rounded-2xl border border-border p-5 sm:p-6 shadow-sm"
              >
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl bg-secondary flex items-center justify-center shrink-0 mt-0.5">
                    {moduleIcons[mod.name] || (
                      <BookOpen className="w-5 h-5 text-primary" />
                    )}
                  </div>
                  <div className="grow">
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                      <h3 className="text-lg font-bold text-foreground">
                        Module {mod.number}: {mod.name}
                      </h3>
                      <span className="text-xs font-semibold text-primary bg-secondary px-2.5 py-1 rounded-full">
                        {mod.lessonCount} Lessons
                      </span>
                    </div>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {mod.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── What Students Receive + Learning Format ── */}
      <section className="py-14 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {/* What Students Receive */}
            <div>
              <h2 className="text-2xl font-extrabold text-foreground mb-6">
                What Students Receive
              </h2>
              <ul className="space-y-4">
                {course.whatStudentsReceive.map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center shrink-0">
                      {featureIcons[item] || (
                        <CheckCircle className="w-5 h-5 text-primary" />
                      )}
                    </div>
                    <span className="text-foreground font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Learning Format */}
            <div>
              <h2 className="text-2xl font-extrabold text-foreground mb-6">
                Learning Format
              </h2>
              <ul className="space-y-4">
                {course.learningFormat.map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center shrink-0">
                      {formatIcons[item] || (
                        <CheckCircle className="w-5 h-5 text-primary" />
                      )}
                    </div>
                    <span className="text-foreground font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <section className="py-16 sm:py-20 bg-primary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white mb-8 leading-tight">
            Ready to Join This Course?
          </h2>
          <Link
            href={`/request-access?course=${course.slug}`}
            className="inline-flex items-center gap-2 bg-white text-primary px-10 py-4 rounded-full text-lg font-bold hover:bg-muted/30 transition-colors shadow-xl"
          >
            Request Access
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </main>
  );
}
