import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col font-sans bg-background text-foreground selection:bg-primary/20 selection:text-primary">
      <Navbar />
      <div className="pt-16 sm:pt-20 flex-1 flex flex-col">
        {children}
      </div>
      <Footer />
    </div>
  );
}
