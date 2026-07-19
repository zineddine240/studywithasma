"use client";

import { useMemo, useState, useTransition, useOptimistic } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import { toast } from "sonner";
import { Loader2, Trash2, Megaphone, Eye } from "lucide-react";
import { deleteAnnouncementAction } from "../actions";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export type Announcement = {
  id: string;
  title: string;
  content: string;
  created_at: string;
};

interface AnnouncementsTableClientProps {
  initialData: Announcement[];
}

export function AnnouncementsTableClient({ initialData }: AnnouncementsTableClientProps) {
  const [isPending, startTransition] = useTransition();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);

  // Optimistic list updates
  const [optimisticAnnouncements, setOptimisticAnnouncements] = useOptimistic(
    initialData,
    (state, idToDelete: string) => state.filter((item) => item.id !== idToDelete)
  );

  const handleDelete = (id: string) => {
    if (!confirm("Are you sure you want to delete this announcement?")) return;
    setDeletingId(id);
    startTransition(async () => {
      setOptimisticAnnouncements(id);
      try {
        const res = await deleteAnnouncementAction(id);
        if (res.error) {
          toast.error(res.error);
        } else {
          toast.success("Announcement deleted successfully");
        }
      } catch {
        toast.error("Failed to delete announcement. Try again.");
      } finally {
        setDeletingId(null);
      }
    });
  };

  const columns = useMemo<ColumnDef<Announcement>[]>(
    () => [
      {
        accessorKey: "title",
        header: "Announcement Title",
        cell: ({ row }) => {
          const title = row.getValue("title") as string;
          return (
            <button
              onClick={() => setSelectedAnnouncement(row.original)}
              className="font-semibold text-foreground hover:text-primary hover:underline transition-all cursor-pointer text-left focus:outline-hidden"
            >
              {title}
            </button>
          );
        },
      },
      {
        accessorKey: "content",
        header: "Content Preview",
        cell: ({ row }) => {
          const content = row.getValue("content") as string;
          return (
            <span className="text-sm text-muted-foreground truncate max-w-sm block">
              {content}
            </span>
          );
        },
      },
      {
        accessorKey: "created_at",
        header: "Published Date",
        cell: ({ row }) => {
          const date = new Date(row.getValue("created_at"));
          return (
            <span className="text-sm text-muted-foreground font-medium">
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
        cell: ({ row }) => {
          const id = row.original.id;
          const isDeleting = isPending && deletingId === id;
          return (
            <div className="flex items-center gap-2 justify-end">
              <button
                onClick={() => setSelectedAnnouncement(row.original)}
                className="inline-flex items-center justify-center h-8 w-8 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors outline-none cursor-pointer"
                title="View Announcement"
              >
                <Eye className="w-4 h-4" />
              </button>
              <button
                disabled={isPending}
                onClick={() => handleDelete(id)}
                className="inline-flex items-center justify-center h-8 w-8 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors outline-none cursor-pointer disabled:opacity-50"
                title="Delete Announcement"
              >
                {isDeleting ? (
                  <Loader2 className="w-4 h-4 animate-spin text-destructive" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
              </button>
            </div>
          );
        },
      },
    ],
    [isPending, deletingId]
  );

  return (
    <>
      <DataTable columns={columns} data={optimisticAnnouncements} />

      <Dialog open={!!selectedAnnouncement} onOpenChange={(open) => !open && setSelectedAnnouncement(null)}>
        {selectedAnnouncement && (
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold flex items-center gap-2">
                <Megaphone className="w-5 h-5 text-primary" />
                Announcement Details
              </DialogTitle>
              <DialogDescription>
                Published on {new Date(selectedAnnouncement.created_at).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 my-2">
              <div>
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Title</h4>
                <p className="text-sm font-bold text-foreground bg-muted/20 px-3 py-2 rounded-md border border-border/30">
                  {selectedAnnouncement.title}
                </p>
              </div>
              <div>
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Content</h4>
                <div className="text-sm bg-muted/40 p-4 rounded-lg border border-border/50 whitespace-pre-wrap leading-relaxed max-h-60 overflow-y-auto font-medium text-foreground">
                  {selectedAnnouncement.content}
                </div>
              </div>
            </div>
            <DialogFooter showCloseButton />
          </DialogContent>
        )}
      </Dialog>
    </>
  );
}
