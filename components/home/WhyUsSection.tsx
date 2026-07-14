import { Route, BookOpen, Video, PenTool, MessageCircle, Laptop } from 'lucide-react';

export default function WhyUsSection() {
  const reasons = [
    {
      title: "Structured IELTS learning path",
      description: "Follow a clear, step-by-step curriculum designed to take you from basics to advanced test strategies.",
      icon: <Route className="w-6 h-6 text-[#7C3AED]" />
    },
    {
      title: "Academic and General IELTS preparation",
      description: "Tailored content for both Academic and General modules to suit your specific migration or study goals.",
      icon: <BookOpen className="w-6 h-6 text-[#7C3AED]" />
    },
    {
      title: "Live and recorded lessons",
      description: "Attend interactive live classes or watch high-quality recorded sessions anytime, anywhere.",
      icon: <Video className="w-6 h-6 text-[#7C3AED]" />
    },
    {
      title: "Clear explanations and practical exercises",
      description: "Understand complex topics easily and practice with exercises that mirror the real IELTS exam.",
      icon: <PenTool className="w-6 h-6 text-[#7C3AED]" />
    },
    {
      title: "Personal guidance and teacher feedback",
      description: "Receive detailed, constructive feedback on your writing and speaking tasks to continuously improve.",
      icon: <MessageCircle className="w-6 h-6 text-[#7C3AED]" />
    },
    {
      title: "Flexible online learning",
      description: "Learn at your own pace with an intuitive platform accessible from any device.",
      icon: <Laptop className="w-6 h-6 text-[#7C3AED]" />
    }
  ];

  return (
    <section className="py-20 bg-[#FFFFFF]" id="why-us">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1E1B4B] mb-4">
            Why Study with Asma
          </h2>
          <p className="text-lg text-[#64748B] max-w-2xl mx-auto">
            Everything you need to succeed in your IELTS journey, brought together in one comprehensive learning experience.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reasons.map((reason, index) => (
            <div key={index} className="bg-[#FAF7FF] p-6 rounded-2xl border border-[#EDE9FE] hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-[#FFFFFF] rounded-xl flex items-center justify-center shadow-sm border border-[#E5E7EB] mb-5">
                {reason.icon}
              </div>
              <h3 className="text-xl font-bold text-[#1E1B4B] mb-3">{reason.title}</h3>
              <p className="text-[#64748B] leading-relaxed">
                {reason.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
