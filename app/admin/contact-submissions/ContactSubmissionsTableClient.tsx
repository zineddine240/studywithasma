"use client";

import { useMemo, useState, useTransition, useOptimistic } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/ui/data-table";
import { StatusDropdown } from "./StatusDropdown";
import { updateSubmissionStatus, type SubmissionStatus } from "./actions";
import { toast } from "sonner";
import { Eye, EyeOff, Loader2, Mail } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export type ContactSubmission = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: SubmissionStatus;
  created_at: string;
};

const statusConfig: Record<
  SubmissionStatus,
  { label: string; variant: "default" | "secondary" | "outline" }
> = {
  unread: { label: "Unread", variant: "default" },
  read: { label: "Read", variant: "secondary" },
  replied: { label: "Replied", variant: "outline" },
};

interface ContactSubmissionsTableClientProps {
  initialData: ContactSubmission[];
  error: string | null;
}

export function ContactSubmissionsTableClient({
  initialData,
  error,
}: ContactSubmissionsTableClientProps) {
  const [isPending, startTransition] = useTransition();
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [selectedSubmission, setSelectedSubmission] = useState<ContactSubmission | null>(null);

  // Optimistic state for the contact submissions list
  const [optimisticSubmissions, setOptimisticSubmissions] = useOptimistic(
    initialData,
    (state, update: { id: string; status: SubmissionStatus }) => {
      return state.map((item) =>
        item.id === update.id ? { ...item, status: update.status } : item,
      );
    },
  );

  const handleUpdateStatus = (id: string, status: SubmissionStatus) => {
    setUpdatingId(id);
    startTransition(async () => {
      // Optimistically update status
      setOptimisticSubmissions({ id, status });
      try {
        await updateSubmissionStatus(id, status);
        toast.success(`Marked as ${status}`);
        // If the open dialog is the one being updated, sync its status
        if (selectedSubmission && selectedSubmission.id === id) {
          setSelectedSubmission((prev) => prev ? { ...prev, status } : null);
        }
      } catch {
        toast.error("Failed to update status. Try again.");
      } finally {
        setUpdatingId(null);
      }
    });
  };

  const columns = useMemo<ColumnDef<ContactSubmission>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Name",
        cell: ({ row, table }) => {
          const meta = table.options.meta as any;
          const isUnread = row.original.status === "unread";
          return (
            <button
              onClick={() => {
                meta.setSelectedSubmission(row.original);
                if (isUnread) {
                  meta.handleUpdateStatus(row.original.id, "read");
                }
              }}
              className={cn(
                "font-medium hover:text-primary hover:underline transition-all cursor-pointer text-left focus:outline-hidden",
                isUnread ? "font-semibold text-foreground" : "text-muted-foreground"
              )}
            >
              {row.getValue("name")}
            </button>
          );
        },
      },
      {
        accessorKey: "email",
        header: "Email",
        cell: ({ row }) => (
          <a
            href={`mailto:${row.getValue("email")}`}
            className="text-primary hover:underline text-sm focus:outline-hidden"
          >
            {row.getValue("email")}
          </a>
        ),
      },
      {
        accessorKey: "subject",
        header: "Subject",
        cell: ({ row, table }) => {
          const meta = table.options.meta as any;
          const isUnread = row.original.status === "unread";
          return (
            <button
              onClick={() => {
                meta.setSelectedSubmission(row.original);
                if (isUnread) {
                  meta.handleUpdateStatus(row.original.id, "read");
                }
              }}
              className={cn(
                "text-sm max-w-50 block truncate text-left hover:text-primary hover:underline transition-all cursor-pointer focus:outline-hidden",
                isUnread ? "font-semibold text-foreground" : "text-muted-foreground"
              )}
              title="Click to view message"
            >
              {row.getValue("subject")}
            </button>
          );
        },
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          const status = row.getValue("status") as SubmissionStatus;
          const config = statusConfig[status] ?? statusConfig.unread;
          return (
            <Badge variant={config.variant} className="text-xs font-medium">
              {config.variant === "default" && (
                <span className="mr-1.5 inline-block w-1.5 h-1.5 rounded-full bg-current opacity-80" />
              )}
              {config.label}
            </Badge>
          );
        },
      },
      {
        accessorKey: "created_at",
        header: "Received",
        cell: ({ row }) => {
          const date = new Date(row.getValue("created_at"));
          return (
            <span className="text-sm text-muted-foreground">
              {date.toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </span>
          );
        },
      },
      {
        id: "actions",
        header: "",
        cell: ({ row, table }) => {
          const meta = table.options.meta as any;
          const isUpdating = meta.isPending && meta.updatingId === row.original.id;
          const status = row.original.status;
          const isUnread = status === "unread";

          return (
            <div className="flex items-center gap-1 justify-end">
              <button
                disabled={meta.isPending}
                onClick={() =>
                  meta.handleUpdateStatus(row.original.id, isUnread ? "read" : "unread")
                }
                className="inline-flex items-center justify-center h-8 w-8 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer disabled:opacity-50"
                title={isUnread ? "Mark as Read" : "Mark as Unread"}
              >
                {isUpdating ? (
                  <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                ) : isUnread ? (
                  <Eye className="w-4 h-4" />
                ) : (
                  <EyeOff className="w-4 h-4" />
                )}
              </button>
              <StatusDropdown
                currentStatus={row.original.status}
                onUpdateStatus={(status) =>
                  meta.handleUpdateStatus(row.original.id, status)
                }
                isPending={isUpdating}
              />
            </div>
          );
        },
      },
    ],
    [],
  );

  const unreadCount = optimisticSubmissions.filter(
    (s) => s.status === "unread",
  ).length;

  return (
    <div className="space-y-6">
      {/* Summary bar */}
      <div className="flex items-center gap-3">
        <span className="text-sm text-muted-foreground">
          {optimisticSubmissions.length} total submission
          {optimisticSubmissions.length !== 1 ? "s" : ""}
        </span>
        {unreadCount > 0 && (
          <Badge variant="default" className="text-xs">
            {unreadCount} unread
          </Badge>
        )}
        {error && (
          <span className="text-sm text-destructive">
            Failed to load submissions: {error}
          </span>
        )}
      </div>

      <DataTable
        columns={columns}
        data={optimisticSubmissions}
        meta={{
          isPending,
          updatingId,
          selectedSubmission,
          handleUpdateStatus,
          setSelectedSubmission,
        }}
      />

      <Dialog open={!!selectedSubmission} onOpenChange={(open) => !open && setSelectedSubmission(null)}>
        {selectedSubmission && (
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold flex items-center gap-2">
                <Mail className="w-5 h-5 text-primary" />
                Contact Submission
              </DialogTitle>
              <DialogDescription>
                Received on {new Date(selectedSubmission.created_at).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit"
                })}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 my-2">
              <div className="grid grid-cols-2 gap-4 bg-muted/30 p-3 rounded-lg border border-border/50">
                <div>
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">From</h4>
                  <p className="text-sm font-bold text-foreground mt-0.5">{selectedSubmission.name}</p>
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Email</h4>
                  <a href={`mailto:${selectedSubmission.email}`} className="text-sm text-primary hover:underline font-medium block mt-0.5 truncate">{selectedSubmission.email}</a>
                </div>
              </div>
              <div>
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Subject</h4>
                <p className="text-sm font-bold text-foreground bg-muted/20 px-3 py-2 rounded-md border border-border/30">{selectedSubmission.subject}</p>
              </div>
              <div>
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Message</h4>
                <div className="text-sm bg-muted/40 p-4 rounded-lg border border-border/50 whitespace-pre-wrap leading-relaxed max-h-60 overflow-y-auto font-medium text-foreground">
                  {selectedSubmission.message}
                </div>
              </div>
            </div>
            <DialogFooter showCloseButton />
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}
