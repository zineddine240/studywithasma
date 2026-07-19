import { createClient } from "@/utils/supabase/server";
import { PageHeader } from "@/components/admin/PageHeader";
import {
  ContactSubmissionsTableClient,
  type ContactSubmission,
} from "./ContactSubmissionsTableClient";

export const metadata = {
  title: "Contact Submissions - Admin",
};

export default async function ContactSubmissionsPage() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("contact_submissions")
    .select("*")
    .order("created_at", { ascending: false });

  const submissions: ContactSubmission[] = data ?? [];

  return (
    <div className="space-y-8">
      <PageHeader
        title="Contact Submissions"
        breadcrumbs={[
          { label: "Dashboard", href: "/admin" },
          { label: "Contact Submissions" },
        ]}
      />

      <ContactSubmissionsTableClient
        initialData={submissions}
        error={error ? error.message : null}
      />
    </div>
  );
}
