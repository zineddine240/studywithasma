import type { Metadata } from "next";
import { PortalLayoutClient } from "@/components/portal/layout/PortalLayoutClient";

export const metadata: Metadata = {
  title: "Student Portal — Study with Asma",
  description: "Private student dashboard.",
};

export default function StudentPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PortalLayoutClient>{children}</PortalLayoutClient>;
}
