"use client"

import { ColumnDef } from "@tanstack/react-table"
import Link from "next/link"
import { DataTable } from "@/components/ui/data-table"

interface TestRow {
  id: string
  title: string
  content_type: string
  created_at: string
}

export const columns: ColumnDef<TestRow>[] = [
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
      const id = row.original.id;
      return (
        <div className="text-right">
          <Link
            href={`/admin/tests/${id}`}
            className="inline-flex items-center justify-center rounded-lg bg-secondary hover:bg-muted text-foreground px-3 py-1.5 text-xs font-semibold transition-all focus:outline-hidden"
          >
            View details
          </Link>
        </div>
      );
    },
  },
]

interface TestsTableClientProps {
  data: TestRow[]
}

export function TestsTableClient({ data }: TestsTableClientProps) {
  return <DataTable columns={columns} data={data} />
}
