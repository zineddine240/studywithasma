"use client";

import { useMemo, useState, useTransition, useOptimistic } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import { toast } from "sonner";
import { Loader2, Trash2, Edit, Play } from "lucide-react";
import { deleteLessonAction } from "../actions";
import Link from "next/link";

export type LessonRow = {
  id: string;
  title: string;
  description?: string;
  video_url: string;
  created_at: string;
  module?: {
    name: string;
    course?: {
      title: string;
    };
  } | null;
};

interface LessonsTableClientProps {
  initialData: LessonRow[];
}

export function LessonsTableClient({ initialData }: LessonsTableClientProps) {
  const [isPending, startTransition] = useTransition();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Optimistic list updates
  const [optimisticLessons, setOptimisticLessons] = useOptimistic(
    initialData,
    (state, idToDelete: string) => state.filter((item) => item.id !== idToDelete)
  );

  const handleDelete = (id: string) => {
    if (!confirm("Are you sure you want to delete this recorded lesson?")) return;
    setDeletingId(id);
    startTransition(async () => {
      setOptimisticLessons(id);
      try {
        const res = await deleteLessonAction(id);
        if (res.error) {
          toast.error(res.error);
        } else {
          toast.success("Lesson deleted successfully");
        }
      } catch {
        toast.error("Failed to delete lesson. Try again.");
      } finally {
        setDeletingId(null);
      }
    });
  };

  const columns = useMemo<ColumnDef<LessonRow>[]>(
    () => [
      {
        accessorKey: "title",
        header: "Lesson Title",
        cell: ({ row }) => {
          const title = row.getValue("title") as string;
          const description = row.original.description;
          return (
            <div>
              <div className="font-semibold text-foreground">{title}</div>
              {description && (
                <div className="text-xs text-muted-foreground mt-0.5 max-w-sm truncate" title={description}>
                  {description}
                </div>
              )}
            </div>
          );
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
        accessorKey: "video_url",
        header: "Video Link",
        cell: ({ row }) => {
          const url = row.getValue("video_url") as string;
          return (
            <a
              href={url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline transition-all truncate max-w-xs focus:outline-hidden"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              Watch Video
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
              <Link
                href={`/admin/lessons/${id}`}
                className="inline-flex items-center justify-center h-8 w-8 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors outline-none"
                title="Edit Lesson"
              >
                <Edit className="w-4 h-4" />
              </Link>
              <button
                disabled={isPending}
                onClick={() => handleDelete(id)}
                className="inline-flex items-center justify-center h-8 w-8 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors outline-none cursor-pointer disabled:opacity-50"
                title="Delete Lesson"
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

  return <DataTable columns={columns} data={optimisticLessons} />;
}
