import type { Metadata } from "next";
import { PortalLayoutClient } from "@/components/portal/layout/PortalLayoutClient";
import PendingApproval from "@/components/portal/layout/PendingApproval";
import EnrollmentExpired from "@/components/portal/layout/EnrollmentExpired";

export const metadata: Metadata = {
  title: "Student Portal - Study with Asma",
  description: "Private student dashboard.",
};

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function StudentPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, is_enrolled, enrollment_expiry")
    .eq("id", user.id)
    .single();

  if (profile?.role === "student") {
    if (!profile?.is_enrolled) {
      return <PendingApproval />;
    }
    
    if (profile?.enrollment_expiry && new Date(profile.enrollment_expiry) < new Date()) {
      return <EnrollmentExpired />;
    }
  }

  return (
    <PortalLayoutClient userEmail={user?.email}>{children}</PortalLayoutClient>
  );
}
