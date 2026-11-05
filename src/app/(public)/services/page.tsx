import type { Metadata } from "next";
import ServicesPageClient from "./ServicesPageClient";

export const metadata: Metadata = {
  title: "Our Advisory Services | Study Abroad Guidance | Study With Asma",
  description:
    "Explore our complete study abroad advisory services: 1-on-1 initial consultation, university selection, document guidance, motivation letter editing, and student visa application support.",
};

export default function ServicesPage() {
  return <ServicesPageClient />;
}

