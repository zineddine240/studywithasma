import { getAllDestinations } from "@/lib/destinationData";
import DestinationsPageClient from "./DestinationsPageClient";

export const metadata = {
  title: "Study Abroad Destinations | France & Italy | Study With Asma",
  description:
    "Explore higher education opportunities in France and Italy. Detailed English-taught degree criteria, IELTS requirements, affordable tuition, DSU scholarships, and visa pathways.",
};

export default function DestinationsPage() {
  const destinations = getAllDestinations();

  return <DestinationsPageClient destinations={destinations} />;
}
