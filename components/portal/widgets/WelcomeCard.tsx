import { PortalCard } from "../shared/PortalCard";
import { createClient } from "@/utils/supabase/server";

export async function WelcomeCard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const name = user?.email?.split('@')[0] || "Student";
  let course = "Not Enrolled";
  let group = "Self-Paced";
  let targetBand = "6.5";

  if (user) {
    const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single();
    if (profile) {
      if (profile.group_name) group = profile.group_name;
      if (profile.target_band) targetBand = profile.target_band;
      
      if (profile.enrolled_course_id) {
        const { data: c } = await supabase.from("courses").select("title").eq("id", profile.enrolled_course_id).single();
        if (c) course = c.title;
      }
    }
  }

  return (
    <PortalCard className="bg-card text-white border-none relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary rounded-full blur-3xl opacity-30 -translate-y-1/2 translate-x-1/3"></div>
      
      <div className="relative z-10">
        <h1 className="text-2xl sm:text-3xl font-extrabold mb-2">
          Welcome back, {name} 👋
        </h1>
        <p className="text-primary/70 text-sm sm:text-base mb-6">
          Continue your IELTS journey with Asma.
        </p>

        <div className="flex flex-wrap gap-3 sm:gap-6">
          <div className="bg-white/10 rounded-xl px-4 py-2 border border-white/10 backdrop-blur-sm">
            <p className="text-xs text-primary/70 mb-0.5 uppercase tracking-wider font-semibold">Course</p>
            <p className="font-bold text-sm">{course}</p>
          </div>
          <div className="bg-white/10 rounded-xl px-4 py-2 border border-white/10 backdrop-blur-sm">
            <p className="text-xs text-primary/70 mb-0.5 uppercase tracking-wider font-semibold">Group</p>
            <p className="font-bold text-sm">{group}</p>
          </div>
          <div className="bg-white/10 rounded-xl px-4 py-2 border border-white/10 backdrop-blur-sm">
            <p className="text-xs text-primary/70 mb-0.5 uppercase tracking-wider font-semibold">Target Band</p>
            <p className="font-bold text-sm">{targetBand}</p>
          </div>
        </div>
      </div>
    </PortalCard>
  );
}
