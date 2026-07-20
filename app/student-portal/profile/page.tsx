import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { StudentProfileForm } from "./StudentProfileForm";
import { User } from "lucide-react";

export const metadata = {
  title: "Profile Settings - Student Portal",
};

export default async function StudentProfilePage() {
  const supabase = await createClient();

  // Get current user session
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch current student profile
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("email, full_name, phone, country, target_band, bio, enrolled_course_id, group_name, is_enrolled")
    .eq("id", user.id)
    .single();

  if (error || !profile) {
    redirect("/student-portal");
  }

  // Fetch enrolled course title if enrolled
  let enrolledCourseTitle: string | null = null;
  if (profile.enrolled_course_id) {
    const { data: c } = await supabase
      .from("courses")
      .select("title")
      .eq("id", profile.enrolled_course_id)
      .single();
    enrolledCourseTitle = c?.title || null;
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-8">
      {/* ── Page Header ── */}
      <section className="bg-card text-card-foreground p-6 sm:p-8 rounded-2xl border border-border">
        <h1 className="text-3xl sm:text-4xl font-extrabold mb-3 tracking-tight flex items-center gap-3 text-foreground">
          <User className="w-8 h-8 text-primary" />
          My Profile
        </h1>
        <p className="text-muted-foreground text-base max-w-2xl leading-relaxed">
          Manage your personal details, contact information, and target IELTS band preferences.
        </p>
      </section>

      <StudentProfileForm
        initialProfile={{
          email: profile.email,
          full_name: profile.full_name,
          phone: profile.phone,
          country: profile.country,
          target_band: profile.target_band,
          bio: profile.bio,
          enrolled_course: enrolledCourseTitle,
          group_name: profile.group_name,
          is_enrolled: !!profile.is_enrolled,
        }}
      />
    </div>
  );
}
