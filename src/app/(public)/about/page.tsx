import type { Metadata } from "next";
import AboutPageClient from "./AboutPageClient";

export const metadata: Metadata = {
  title: "About Us - Study with Asma",
  description:
    "Learn more about Asma's background, qualifications, and teaching philosophy for IELTS preparation.",
};

export default function AboutPage() {
  return <AboutPageClient />;
}
