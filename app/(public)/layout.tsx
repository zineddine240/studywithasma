import Navbar from "@/components/layout/Navbar";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col font-sans bg-background">
      <Navbar />
      {children}
      <footer className="bg-card py-8 text-center text-muted-foreground text-sm mt-auto">
        <p>&copy; {new Date().getFullYear()} Study with Asma. All rights reserved.</p>
      </footer>
    </div>
  );
}
