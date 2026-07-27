"use client";

import { useMemo, useState, useTransition, useOptimistic } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import { toast } from "sonner";
import { Loader2, Trash2, Megaphone, Eye } from "lucide-react";
import { deleteTestimonialAction, updateTestimonialAction } from "../actions";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export type Testimonial = {
  id: string;
  name: string;
  band: string | null;
  role: string | null;
  text: string;
  is_published: boolean;
  created_at: string;
};

interface TestimonialsTableClientProps {
  initialData: Testimonial[];
}

export function TestimonialsTableClient({ initialData }: TestimonialsTableClientProps) {
  const [isPending, startTransition] = useTransition();
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [selectedTestimonial, setSelectedTestimonial] = useState<Testimonial | null>(null);

  const [optimisticTestimonials, setOptimisticTestimonials] = useOptimistic(
    initialData,
    (state, action: { type: 'delete' | 'toggle', id: string, is_published?: boolean }) => {
      if (action.type === 'delete') {
        return state.filter((item) => item.id !== action.id);
      }
      if (action.type === 'toggle') {
        return state.map((item) =>
          item.id === action.id ? { ...item, is_published: action.is_published! } : item
        );
      }
      return state;
    }
  );

  const handleDelete = (id: string) => {
    if (!confirm("Are you sure you want to delete this testimonial?")) return;
    setProcessingId(id);
    startTransition(async () => {
      setOptimisticTestimonials({ type: 'delete', id });
      try {
        const res = await deleteTestimonialAction(id);
        if (res.error) {
          toast.error(res.error);
        } else {
          toast.success("Testimonial deleted successfully");
        }
      } catch {
        toast.error("Failed to delete testimonial. Try again.");
      } finally {
        setProcessingId(null);
      }
    });
  };

  const handleTogglePublished = (id: string, currentStatus: boolean) => {
    setProcessingId(id);
    const newStatus = !currentStatus;
    startTransition(async () => {
      setOptimisticTestimonials({ type: 'toggle', id, is_published: newStatus });
      try {
        const res = await updateTestimonialAction(id, { is_published: newStatus });
        if (res.error) {
          toast.error(res.error);
        } else {
          toast.success(`Testimonial ${newStatus ? 'published' : 'unpublished'}`);
        }
      } catch {
        toast.error("Failed to update status. Try again.");
      } finally {
        setProcessingId(null);
      }
    });
  };

  const columns = useMemo<ColumnDef<Testimonial>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => {
          const name = row.getValue("name") as string;
          return (
            <button
              onClick={() => setSelectedTestimonial(row.original)}
              className="font-semibold text-foreground hover:text-primary hover:underline transition-all cursor-pointer text-left focus:outline-hidden"
            >
              {name}
            </button>
          );
        },
      },
      {
        accessorKey: "band",
        header: "Band / Role",
        cell: ({ row }) => {
          const band = row.original.band;
          const role = row.original.role;
          return (
            <div className="flex flex-col">
              <span className="text-sm font-medium">{band || "-"}</span>
              <span className="text-xs text-muted-foreground">{role || "-"}</span>
            </div>
          );
        },
      },
      {
        accessorKey: "is_published",
        header: "Published",
        cell: ({ row }) => {
          const isPublished = row.getValue("is_published") as boolean;
          const id = row.original.id;
          return (
            <div className="flex items-center">
              <Switch
                checked={isPublished}
                onCheckedChange={() => handleTogglePublished(id, isPublished)}
                disabled={isPending && processingId === id}
              />
            </div>
          );
        },
      },
      {
        accessorKey: "created_at",
        header: "Date",
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
          const isDeleting = isPending && processingId === id;
          return (
            <div className="flex items-center gap-2 justify-end">
              <button
                onClick={() => setSelectedTestimonial(row.original)}
                className="inline-flex items-center justify-center h-8 w-8 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors outline-none cursor-pointer"
                title="View Testimonial"
              >
                <Eye className="w-4 h-4" />
              </button>
              <button
                disabled={isPending}
                onClick={() => handleDelete(id)}
                className="inline-flex items-center justify-center h-8 w-8 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors outline-none cursor-pointer disabled:opacity-50"
                title="Delete Testimonial"
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
    [isPending, processingId]
  );

  return (
    <>
      <DataTable columns={columns} data={optimisticTestimonials} />

      <Dialog open={!!selectedTestimonial} onOpenChange={(open) => !open && setSelectedTestimonial(null)}>
        {selectedTestimonial && (
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold flex items-center gap-2">
                <Megaphone className="w-5 h-5 text-primary" />
                Testimonial Details
              </DialogTitle>
              <DialogDescription>
                Submitted on {new Date(selectedTestimonial.created_at).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 my-2">
              <div className="flex gap-4">
                <div className="flex-1">
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Name</h4>
                  <p className="text-sm font-bold text-foreground bg-muted/20 px-3 py-2 rounded-md border border-border/30">
                    {selectedTestimonial.name}
                  </p>
                </div>
                <div className="flex-1">
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Band</h4>
                  <p className="text-sm font-bold text-foreground bg-muted/20 px-3 py-2 rounded-md border border-border/30">
                    {selectedTestimonial.band || "N/A"}
                  </p>
                </div>
              </div>
              <div>
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Role</h4>
                <p className="text-sm font-bold text-foreground bg-muted/20 px-3 py-2 rounded-md border border-border/30">
                  {selectedTestimonial.role || "N/A"}
                </p>
              </div>
              <div>
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Content</h4>
                <div className="text-sm bg-muted/40 p-4 rounded-lg border border-border/50 whitespace-pre-wrap leading-relaxed max-h-60 overflow-y-auto font-medium text-foreground italic">
                  "{selectedTestimonial.text}"
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
