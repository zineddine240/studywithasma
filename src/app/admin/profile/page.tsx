import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { PageHeader } from "@/components/admin/PageHeader";
import { ProfileForm } from "./ProfileForm";

export const metadata = {
  title: "Profile Settings - Admin",
};

export default async function AdminProfilePage() {
  const supabase = await createClient();

  // Get current user session
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch current user profile
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("email, role, full_name, bio")
    .eq("id", user.id)
    .single();

  if (error || !profile) {
    redirect("/admin");
  }

  // Ensure user is an admin or teacher
  if (profile.role !== "admin" && profile.role !== "teacher") {
    redirect("/student-portal");
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="My Profile"
        breadcrumbs={[
          { label: "Dashboard", href: "/admin" },
          { label: "Profile" },
        ]}
      />

      <ProfileForm
        initialProfile={{
          email: profile.email,
          full_name: profile.full_name,
          bio: profile.bio,
          role: profile.role as "admin" | "teacher",
        }}
      />
    </div>
  );
}
