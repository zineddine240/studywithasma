"use client"

import { ColumnDef } from "@tanstack/react-table"
import { DataTable } from "@/components/ui/data-table"
import Link from "next/link"
import { Edit, Video } from "lucide-react"
import { Button } from "@/components/ui/button"

interface LiveClassRow {
  id: string
  title: string
  description?: string
  scheduled_at: string
  meeting_link: string
  recording_url?: string
  cohorts?: { name: string } | null
}

export const columns: ColumnDef<LiveClassRow>[] = [
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => {
      const title = row.getValue("title") as string;
      const description = row.original.description;
      return (
        <div>
          <div className="text-sm font-semibold text-foreground">{title}</div>
          {description && (
            <div className="text-xs text-muted-foreground mt-0.5 max-w-md truncate">
              {description}
            </div>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "cohort",
    header: "Group",
    cell: ({ row }) => {
      const cohort = row.original.cohorts;
      return (
        <span className="text-sm">
          {cohort ? (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
              {cohort.name}
            </span>
          ) : (
            <span className="text-muted-foreground text-xs">Global</span>
          )}
        </span>
      );
    },
  },
  {
    accessorKey: "scheduled_at",
    header: "Scheduled For",
    cell: ({ row }) => {
      const dateStr = row.getValue("scheduled_at") as string;
      const date = new Date(dateStr);
      return (
        <span className="text-sm text-muted-foreground font-medium">
          {date.toLocaleString("en-GB", {
            weekday: "short",
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      );
    },
  },
  {
    accessorKey: "meeting_link",
    header: "Access Link",
    cell: ({ row }) => {
      const meetingLink = row.getValue("meeting_link") as string;
      const recordingUrl = row.original.recording_url;
      
      if (recordingUrl) {
        return (
          <a
            href={recordingUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline transition-all focus:outline-hidden"
          >
            <Video className="w-4 h-4" />
            Watch Recording
          </a>
        );
      }

      return (
        <a
          href={meetingLink}
          target="_blank"
          rel="noreferrer"
          className="text-sm font-semibold text-blue-600 hover:text-blue-700 hover:underline transition-all truncate max-w-[200px] block focus:outline-hidden"
        >
          {meetingLink}
        </a>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const id = row.original.id;
      return (
        <div className="flex justify-end">
          <Link href={`/admin/live-classes/${id}`}>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
              <Edit className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      );
    },
  },
]

interface LiveClassesTableClientProps {
  data: LiveClassRow[]
}

export function LiveClassesTableClient({ data }: LiveClassesTableClientProps) {
  return <DataTable columns={columns} data={data} />
}
