import { BookOpen, Headphones, PenTool, Mic, BookText } from 'lucide-react';

export default function CoursesPreviewSection() {
  const courses = [
    {
      title: "Academic IELTS",
      description: "Designed for students who want to study at a university or higher education institution, or professionals seeking registration in an English-speaking environment.",
      icon: <BookOpen className="w-8 h-8 text-[#7C3AED]" />,
      modules: ["Introduction", "Listening", "Reading", "Writing", "Speaking"]
    },
    {
      title: "General IELTS",
      description: "Ideal for those who want to migrate to an English-speaking country for secondary education, work experience, or training programs.",
      icon: <BookText className="w-8 h-8 text-[#7C3AED]" />,
      modules: ["Introduction", "Listening", "Reading", "Writing", "Speaking"]
    }
  ];

  const getModuleIcon = (module: string) => {
    switch(module) {
      case "Introduction": return <BookOpen className="w-4 h-4" />;
      case "Listening": return <Headphones className="w-4 h-4" />;
      case "Reading": return <BookText className="w-4 h-4" />;
      case "Writing": return <PenTool className="w-4 h-4" />;
      case "Speaking": return <Mic className="w-4 h-4" />;
      default: return <BookOpen className="w-4 h-4" />;
    }
  };

  return (
    <section className="py-20 bg-[#FFFFFF]" id="courses">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1E1B4B] mb-4">
            Our IELTS Courses
          </h2>
          <p className="text-lg text-[#64748B] max-w-2xl mx-auto">
            Choose the right path for your goals. We offer comprehensive preparation for both Academic and General IELTS.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-10 max-w-5xl mx-auto">
          {courses.map((course, index) => (
            <div key={index} className="bg-[#FAF7FF] rounded-2xl p-8 border border-[#EDE9FE] shadow-sm hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-[#FFFFFF] rounded-2xl flex items-center justify-center shadow-sm border border-[#E5E7EB] mb-6">
                {course.icon}
              </div>
              <h3 className="text-2xl font-bold text-[#1E1B4B] mb-3">{course.title}</h3>
              <p className="text-[#64748B] mb-8 leading-relaxed">
                {course.description}
              </p>
              
              <div>
                <h4 className="text-sm font-semibold text-[#1E1B4B] uppercase tracking-wider mb-4">Course Modules</h4>
                <ul className="space-y-3">
                  {course.modules.map((module, i) => (
                    <li key={i} className="flex items-center text-[#1E1B4B] font-medium bg-[#FFFFFF] px-4 py-3 rounded-xl border border-[#EDE9FE]">
                      <span className="text-[#7C3AED] mr-3">
                        {getModuleIcon(module)}
                      </span>
                      {module}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
