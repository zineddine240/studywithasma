import Navbar from "@/components/layout/Navbar";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col font-sans bg-white">
      <Navbar />
      {children}
      <footer className="bg-[#1E1B4B] py-8 text-center text-[#64748B] text-sm mt-auto">
        <p>&copy; {new Date().getFullYear()} Study with Asma. All rights reserved.</p>
      </footer>
    </div>
  );
}
