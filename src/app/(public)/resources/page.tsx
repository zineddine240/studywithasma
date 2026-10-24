import { getAllArticles } from "@/lib/resourceData";
import ResourcesPageClient from "./ResourcesPageClient";

export const metadata = {
  title: "Educational Resources & IELTS Guides | Study With Asma",
  description:
    "Actionable examiner tips, IELTS writing and speaking strategies, study-abroad destination comparisons, and international scholarship application advice.",
};

export default function ResourcesPage() {
  const articles = getAllArticles();

  return <ResourcesPageClient articles={articles} />;
}
