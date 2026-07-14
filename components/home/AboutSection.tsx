import { CheckCircle } from 'lucide-react';

export default function AboutSection() {
  return (
    <section className="py-20 bg-[#FAF7FF]" id="about">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl relative z-10 bg-[#FFFFFF] flex items-center justify-center p-8 border border-[#EDE9FE]">
              <div className="w-full h-full bg-[#EDE9FE] rounded-2xl flex items-center justify-center text-[#7C3AED] font-semibold text-lg opacity-80">
                [Teacher / Platform Image Placeholder]
              </div>
            </div>
            {/* Decorative elements */}
            <div className="absolute -top-6 -left-6 w-32 h-32 bg-[#E5E7EB] rounded-full blur-2xl -z-10 opacity-50"></div>
            <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-purple-200 rounded-full blur-3xl -z-10 opacity-60"></div>
          </div>
          
          <div>
            <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-[#EDE9FE] text-[#7C3AED] mb-6">
              About Study with Asma
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1E1B4B] mb-6 leading-tight">
              Achieve Your Dream Score with Confidence
            </h2>
            <p className="text-lg text-[#64748B] mb-8 leading-relaxed">
              Study with Asma is an online IELTS preparation platform designed to help students prepare for both Academic and General IELTS. Through structured lessons, recorded sessions, practical exercises, and personal guidance, students can improve their Listening, Reading, Writing, and Speaking skills with confidence.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <CheckCircle className="w-6 h-6 text-[#7C3AED] mt-0.5 mr-3 shrink-0" />
                <p className="text-[#1E1B4B] font-medium">Expert guidance tailored to your current level</p>
              </div>
              <div className="flex items-start">
                <CheckCircle className="w-6 h-6 text-[#7C3AED] mt-0.5 mr-3 shrink-0" />
                <p className="text-[#1E1B4B] font-medium">Interactive learning environment</p>
              </div>
              <div className="flex items-start">
                <CheckCircle className="w-6 h-6 text-[#7C3AED] mt-0.5 mr-3 shrink-0" />
                <p className="text-[#1E1B4B] font-medium">Focus on real exam strategies and techniques</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
