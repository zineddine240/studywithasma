import { Clock } from "lucide-react";
import Link from "next/link";

export default function PendingApproval() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="max-w-md w-full bg-card rounded-2xl border border-border p-8 text-center space-y-6 shadow-sm">
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
          <Clock className="w-10 h-10 text-primary animate-pulse" />
        </div>
        <h1 className="text-2xl font-extrabold text-foreground">
          Enrollment Pending
        </h1>
        <p className="text-muted-foreground leading-relaxed">
          Your enrollment request has been received and is currently under review by Asma. 
          You will gain access to the Student Portal once your request is approved.
        </p>
        <div className="pt-4 flex flex-col sm:flex-row gap-3">
          <Link
            href="/"
            className="flex-1 inline-flex items-center justify-center bg-primary text-white px-8 py-3 rounded-full font-semibold hover:bg-primary/90 transition-colors"
          >
            Return to Home
          </Link>
          <form action="/auth/signout" method="post" className="flex-1">
            <button
              type="submit"
              className="w-full inline-flex items-center justify-center bg-muted text-foreground px-8 py-3 rounded-full font-semibold hover:bg-muted/80 transition-colors"
            >
              Sign Out
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
