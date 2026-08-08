"use client";

import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Edit, Trash2, Eye, Loader2, MoreHorizontal, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
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
  const router = useRouter();
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
        const test = row.original;
        
        return (
          <ContextMenu>
            <ContextMenuTrigger className="block w-full">
              <div>
                <Link
                  href={`/admin/tests/${test.id}`}
                  className="text-sm font-semibold text-foreground hover:text-primary hover:underline transition-all block focus:outline-hidden"
                >
                  {title}
                </Link>
                <div className="text-xs text-muted-foreground mt-0.5 capitalize">
                  Type: {type.replace("_", " ")}
                </div>
              </div>
            </ContextMenuTrigger>
            <ContextMenuContent className="w-48">
              <ContextMenuItem onClick={() => router.push(`/admin/tests/${test.id}`)} className="cursor-pointer">
                <Eye className="w-4 h-4 mr-2" />
                View details
              </ContextMenuItem>
              <ContextMenuItem onClick={() => router.push(`/admin/tests/${test.id}/preview`)} className="cursor-pointer">
                <ExternalLink className="w-4 h-4 mr-2" />
                Preview test
              </ContextMenuItem>
              <ContextMenuSeparator />
              <ContextMenuItem onClick={() => router.push(`/admin/tests/${test.id}/edit`)} className="cursor-pointer text-primary focus:text-primary">
                <Edit className="w-4 h-4 mr-2" />
                Edit test
              </ContextMenuItem>
              <ContextMenuItem 
                onClick={() => handleDeletePrompt(test)}
                className="text-destructive focus:text-destructive cursor-pointer"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete test
              </ContextMenuItem>
            </ContextMenuContent>
          </ContextMenu>
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
          <div className="flex items-center justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger className="h-8 w-8 p-0 inline-flex items-center justify-center rounded-md hover:bg-muted focus-visible:ring-1 border-0 bg-transparent text-foreground">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => router.push(`/admin/tests/${test.id}`)} className="cursor-pointer">
                  <Eye className="w-4 h-4 mr-2" />
                  View details
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push(`/admin/tests/${test.id}/preview`)} className="cursor-pointer">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Preview test
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push(`/admin/tests/${test.id}/edit`)} className="cursor-pointer text-primary focus:text-primary">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit test
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => handleDeletePrompt(test)}
                  className="text-destructive focus:text-destructive cursor-pointer"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete test
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
