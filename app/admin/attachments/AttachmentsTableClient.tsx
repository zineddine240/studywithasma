"use client";

import { useMemo, useState, useTransition, useOptimistic } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import { toast } from "sonner";
import { Loader2, Trash2, Paperclip } from "lucide-react";
import { deleteAttachmentAction } from "../actions";

export type AttachmentRow = {
  id: string;
  title: string;
  file_url: string;
  created_at: string;
  module?: {
    name: string;
    course?: {
      title: string;
    };
  } | null;
};

interface AttachmentsTableClientProps {
  initialData: AttachmentRow[];
}

export function AttachmentsTableClient({ initialData }: AttachmentsTableClientProps) {
  const [isPending, startTransition] = useTransition();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [optimisticAttachments, setOptimisticAttachments] = useOptimistic(
    initialData,
    (state, idToDelete: string) => state.filter((item) => item.id !== idToDelete)
  );

  const handleDelete = (id: string) => {
    if (!confirm("Are you sure you want to delete this attachment?")) return;
    setDeletingId(id);
    startTransition(async () => {
      setOptimisticAttachments(id);
      try {
        const res = await deleteAttachmentAction(id);
        if (res.error) {
          toast.error(res.error);
        } else {
          toast.success("Attachment deleted successfully");
        }
      } catch {
        toast.error("Failed to delete attachment. Try again.");
      } finally {
        setDeletingId(null);
      }
    });
  };

  const columns = useMemo<ColumnDef<AttachmentRow>[]>(
    () => [
      {
        accessorKey: "title",
        header: "Title",
        cell: ({ row }) => {
          const title = row.getValue("title") as string;
          return <div className="font-semibold text-foreground">{title}</div>;
        },
      },
      {
        accessorKey: "module",
        header: "Course & Module",
        cell: ({ row }) => {
          const mod = row.original.module;
          if (!mod) {
            return <span className="text-xs text-muted-foreground italic">Global / Unlinked</span>;
          }
          return (
            <div>
              <div className="text-sm font-medium text-foreground">{mod.name}</div>
              <div className="text-xs text-muted-foreground">{mod.course?.title}</div>
            </div>
          );
        },
      },
      {
        accessorKey: "file_url",
        header: "File Link",
        cell: ({ row }) => {
          const url = row.getValue("file_url") as string;
          return (
            <a
              href={url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline transition-all truncate max-w-xs focus:outline-hidden"
            >
              <Paperclip className="w-3.5 h-3.5" />
              Open File
            </a>
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
                disabled={isPending}
                onClick={() => handleDelete(id)}
                className="inline-flex items-center justify-center h-8 w-8 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors outline-none cursor-pointer disabled:opacity-50"
                title="Delete Attachment"
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

  return <DataTable columns={columns} data={optimisticAttachments} />;
}
