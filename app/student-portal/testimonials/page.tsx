import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { Star } from "lucide-react";
import { StudentTestimonialClient } from "./StudentTestimonialClient";

export const metadata = {
  title: "My Testimonials - Student Portal",
};

export default async function StudentTestimonialPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch student's profile to prepopulate name/role
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, target_band")
    .eq("id", user.id)
    .single();

  // Fetch existing testimonials for this student
  const { data: existingTestimonials } = await supabase
    .from("testimonials")
    .select("*")
    .eq("student_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-8">
      {/* ── Page Header ── */}
      <section className="bg-card text-card-foreground p-6 sm:p-8 rounded-2xl border border-border">
        <h1 className="text-3xl sm:text-4xl font-extrabold mb-3 tracking-tight flex items-center gap-3 text-foreground">
          <Star className="w-8 h-8 text-primary" />
          My Testimonials
        </h1>
        <p className="text-muted-foreground text-base max-w-2xl leading-relaxed">
          Share your success story and inspire future students. Let us know how the course helped you achieve your target band!
        </p>
      </section>

      <StudentTestimonialClient
        initialData={existingTestimonials || []}
        profile={{
          full_name: profile?.full_name || "",
          target_band: profile?.target_band || "",
        }}
      />
    </div>
  );
}
