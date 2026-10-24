import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ModeToggleForms from "../ModeToggleForms";

export default function NewTestPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/tests" className="p-2 hover:bg-muted rounded-full transition-colors">
          <ArrowLeft className="w-5 h-5 text-muted-foreground" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Create New Test</h1>
          <p className="text-sm text-muted-foreground">Add a new assessment or practice test</p>
        </div>
      </div>
      
      <ModeToggleForms />
    </div>
  );
}
