"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Edit, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
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

interface TestDetailActionsProps {
  test: {
    id: string;
    title: string;
    content_type: string;
    content_data: any;
  };
}

export function TestDetailActions({ test }: TestDetailActionsProps) {
  const router = useRouter();
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const confirmDelete = async () => {
    setIsDeleting(true);
    try {
      const res = await deleteTestAction(test.id);
      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success("Test deleted successfully.");
        router.push("/admin/tests");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to delete test.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div className="flex items-center gap-2">
        <Link
          href={`/admin/tests/${test.id}/edit`}
          className="inline-flex items-center justify-center rounded-lg border border-primary/20 hover:bg-primary/10 text-primary px-3 py-1.5 text-xs font-bold transition-all focus:outline-hidden gap-1.5"
        >
          <Edit className="w-4 h-4 text-primary" />
          Edit Test
        </Link>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsDeleteOpen(true)}
          className="font-bold text-destructive hover:bg-destructive/10 flex items-center gap-1.5"
        >
          <Trash2 className="w-4 h-4" />
          Delete
        </Button>
      </div>

      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-destructive flex items-center gap-2">
              <Trash2 className="w-5 h-5" />
              Delete Test
            </DialogTitle>
            <DialogDescription className="pt-2 text-foreground/80">
              Are you sure you want to delete <span className="font-bold text-foreground">"{test.title}"</span>?
              <br />
              This action cannot be undone.
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
