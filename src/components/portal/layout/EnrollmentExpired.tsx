import { AlertTriangle } from "lucide-react";
import Link from "next/link";

export default function EnrollmentExpired() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="max-w-md w-full bg-card rounded-2xl border border-border p-8 text-center space-y-6 shadow-sm">
        <div className="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center mx-auto">
          <AlertTriangle className="w-10 h-10 text-destructive" />
        </div>
        <h1 className="text-2xl font-extrabold text-foreground">
          Enrollment Expired
        </h1>
        <p className="text-muted-foreground leading-relaxed">
          Your access to the Student Portal has expired. If you would like to renew your access or have questions, please contact Asma.
        </p>
        <div className="pt-4 flex flex-col sm:flex-row gap-3">
          <Link
            href="/contact"
            className="flex-1 inline-flex items-center justify-center bg-primary text-white px-8 py-3 rounded-full font-semibold hover:bg-primary/90 transition-colors"
          >
            Contact Teacher
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
