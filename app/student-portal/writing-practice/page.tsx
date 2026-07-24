import { WritingTestLibrary } from "@/components/portal/writing/WritingTestLibrary";

export const metadata = {
  title: "IELTS Writing Practice Library | Study with Asma",
  description: "Practice your IELTS Writing Task 1 and Task 2 with instant AI correction.",
};

export default function WritingPracticePage() {
  return (
    <div className="w-full h-full flex flex-col max-w-[1600px] mx-auto space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight mb-2">
          Writing Practice Library
        </h1>
        <p className="text-muted-foreground">
          Select a test from the library, write your essay, and receive instant AI feedback.
        </p>
      </div>

      <WritingTestLibrary />
    </div>
  );
}
