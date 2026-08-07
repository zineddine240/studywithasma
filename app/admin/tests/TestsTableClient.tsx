"use client";

import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { Edit, Trash2, Eye, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { deleteTestAction } from "./actions";

interface TestRow {
  id: string;
  title: string;
  content_type: string;
  content_data?: any;
  created_at: string;
}

interface TestsTableClientProps {
  data: TestRow[];
}

export function TestsTableClient({ data }: TestsTableClientProps) {
  const [deletingTest, setDeletingTest] = useState<TestRow | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeletePrompt = (test: TestRow) => {
    setDeletingTest(test);
    setIsDeleteOpen(true);
  };

  const confirmDelete = async () => {
    if (!deletingTest) return;
    setIsDeleting(true);
    try {
      const res = await deleteTestAction(deletingTest.id);
      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success("Test deleted successfully.");
        setIsDeleteOpen(false);
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to delete test.");
    } finally {
      setIsDeleting(false);
    }
  };

  const columns: ColumnDef<TestRow>[] = [
    {
      accessorKey: "title",
      header: "Test Detail",
      cell: ({ row }) => {
        const title = row.getValue("title") as string;
        const type = row.original.content_type;
        const id = row.original.id;
        return (
          <div>
            <Link
              href={`/admin/tests/${id}`}
              className="text-sm font-semibold text-foreground hover:text-primary hover:underline transition-all block focus:outline-hidden"
            >
              {title}
            </Link>
            <div className="text-xs text-muted-foreground mt-0.5 capitalize">
              Type: {type.replace("_", " ")}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "created_at",
      header: "Created Date",
      cell: ({ row }) => {
        const dateStr = row.getValue("created_at") as string;
        const date = new Date(dateStr);
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
      cell: ({ row }) => {
        const test = row.original;
        return (
          <div className="flex items-center justify-end gap-2">
            <Link
              href={`/admin/tests/${test.id}`}
              className="inline-flex items-center justify-center rounded-lg bg-secondary hover:bg-muted text-foreground px-3 py-1.5 text-xs font-semibold transition-all focus:outline-hidden gap-1"
            >
              <Eye className="w-3.5 h-3.5" />
              View details
            </Link>
            <Link
              href={`/admin/tests/${test.id}/edit`}
              className="inline-flex items-center justify-center rounded-lg border border-primary/20 hover:bg-primary/10 text-primary px-2.5 py-1.5 text-xs font-semibold transition-all focus:outline-hidden gap-1"
            >
              <Edit className="w-3.5 h-3.5" />
              Edit
            </Link>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDeletePrompt(test)}
              className="h-8 px-2.5 text-xs font-semibold text-destructive hover:bg-destructive/10 gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Delete
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <>
      <DataTable columns={columns} data={data} />

      {/* Delete Test Modal */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-destructive flex items-center gap-2">
              <Trash2 className="w-5 h-5" />
              Delete Test
            </DialogTitle>
            <DialogDescription className="pt-2 text-foreground/80">
              Are you sure you want to delete <span className="font-bold text-foreground">"{deletingTest?.title}"</span>?
              <br />
              This action cannot be undone and will permanently remove the test and associated data.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-6 gap-2">
            <Button
              variant="outline"
              onClick={() => setIsDeleteOpen(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={isDeleting}
              className="font-bold flex items-center gap-2"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="animate-spin h-4 w-4" />
                  Deleting...
                </>
              ) : (
                "Delete Test"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
