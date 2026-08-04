import { createClient } from "@/utils/supabase/server";
import { PageHeader } from "@/components/admin/PageHeader";
import {
  ContactSubmissionsTableClient,
  type ContactSubmission,
} from "./ContactSubmissionsTableClient";
import { getPagination, getTotalPages } from "@/lib/utils/pagination";

export const metadata = {
  title: "Contact Submissions - Admin",
};

export default async function ContactSubmissionsPage(props: { searchParams: Promise<{ page?: string }> }) {
  const searchParams = await props.searchParams;
  const page = searchParams.page ? parseInt(searchParams.page, 10) : 1;
  const { from, to, limit } = getPagination(page, 10);

  const supabase = await createClient();

  const { data, error, count } = await supabase
    .from("contact_submissions")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to);

  const submissions: ContactSubmission[] = data ?? [];
  const totalPages = getTotalPages(count, limit);

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
        currentPage={page}
        totalPages={totalPages}
      />
    </div>
  );
}
