"use client";

import { MoreHorizontal, Loader2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { SubmissionStatus } from "./actions";

interface StatusDropdownProps {
  currentStatus: SubmissionStatus;
  onUpdateStatus: (status: SubmissionStatus) => void;
  isPending: boolean;
}

export function StatusDropdown({
  currentStatus,
  onUpdateStatus,
  isPending,
}: StatusDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        disabled={isPending}
        className="inline-flex items-center justify-center h-8 w-8 rounded-md hover:bg-muted transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer disabled:opacity-50"
        aria-label="Actions"
      >
        {isPending ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <MoreHorizontal className="w-4 h-4" />
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Update Status</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer"
          disabled={currentStatus === "unread" || isPending}
          onClick={() => onUpdateStatus("unread")}
        >
          Mark as Unread
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer"
          disabled={currentStatus === "read" || isPending}
          onClick={() => onUpdateStatus("read")}
        >
          Mark as Read
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer"
          disabled={currentStatus === "replied" || isPending}
          onClick={() => onUpdateStatus("replied")}
        >
          Mark as Replied
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
