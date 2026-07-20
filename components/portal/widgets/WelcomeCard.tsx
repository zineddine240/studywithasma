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
    <PortalCard className="bg-card text-card-foreground border border-border relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
      
      <div className="relative z-10">
        <h1 className="text-2xl sm:text-3xl font-extrabold mb-2 text-foreground tracking-tight">
          Welcome back, {name} 👋
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base mb-6">
          Continue your IELTS journey with Asma.
        </p>

        <div className="flex flex-wrap gap-3 sm:gap-6">
          <div className="bg-muted/50 rounded-xl px-4 py-2.5 border border-border">
            <p className="text-xs text-muted-foreground mb-0.5 uppercase tracking-wider font-semibold">Course</p>
            <p className="font-bold text-sm text-foreground">{course}</p>
          </div>
          <div className="bg-muted/50 rounded-xl px-4 py-2.5 border border-border">
            <p className="text-xs text-muted-foreground mb-0.5 uppercase tracking-wider font-semibold">Group</p>
            <p className="font-bold text-sm text-foreground">{group}</p>
          </div>
          <div className="bg-muted/50 rounded-xl px-4 py-2.5 border border-border">
            <p className="text-xs text-muted-foreground mb-0.5 uppercase tracking-wider font-semibold">Target Band</p>
            <p className="font-bold text-sm text-foreground">{targetBand}</p>
          </div>
        </div>
      </div>
    </PortalCard>
  );
}
