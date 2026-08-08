"use client";

import { useState, useEffect } from "react";
import { Search, PenTool, CheckCircle2, FileEdit, MessageSquareQuote, Inbox } from "lucide-react";
import { getWritingStatus, WritingTestStatus } from "@/lib/storage/writing-storage";
import { WritingTestCard, WritingTestItem } from "./WritingTestCard";

interface DbTestRow {
  id: string;
  title: string;
  content_type: string;
  content_data?: any;
  created_at: string;
}

interface WritingTestLibraryProps {
  initialTests: DbTestRow[];
}

export function WritingTestLibrary({ initialTests }: WritingTestLibraryProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statuses, setStatuses] = useState<Record<string, WritingTestStatus>>({});
  const [isClient, setIsClient] = useState(false);

  // Format DB tests into WritingTestItem
  const formattedTests: WritingTestItem[] = initialTests.map((t) => {
    const data = t.content_data || {};
    const passage = data.passage || "";
    return {
      id: t.id,
      title: t.title,
      taskType: "Writing Practice",
      topicSummary: passage ? (passage.length > 120 ? passage.slice(0, 120) + "..." : passage) : "Writing Practice Prompt",
      prompt: passage,
      recommendedTime: data.recommendedTime || 40,
      minWords: data.minWords || 250,
    };
  });

  // Load statuses on client mount
  useEffect(() => {
    const loadedStatuses: Record<string, WritingTestStatus> = {};
    formattedTests.forEach((test) => {
      loadedStatuses[test.id] = getWritingStatus(test.id);
    });
    setStatuses(loadedStatuses);
    setIsClient(true);
  }, [initialTests]);

  // Filter logic
  const filteredTests = formattedTests.filter((test) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      test.title.toLowerCase().includes(searchLower) ||
      test.topicSummary.toLowerCase().includes(searchLower)
    );
  });

  const totalTests = formattedTests.length;
  const completedCount = isClient ? Object.values(statuses).filter((s) => s === "Completed").length : 0;
  const draftCount = isClient ? Object.values(statuses).filter((s) => s === "Draft").length : 0;

  return (
    <div className="space-y-8">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-card rounded-2xl p-5 border border-border shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/10 text-primary rounded-lg">
              <PenTool className="w-5 h-5" />
            </div>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Total Tests</p>
          </div>
          <p className="text-3xl font-black text-foreground">{totalTests}</p>
        </div>

        <div className="bg-card rounded-2xl p-5 border border-border shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-emerald-500/10 text-emerald-600 rounded-lg">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Completed</p>
          </div>
          <p className="text-3xl font-black text-foreground">{completedCount}</p>
        </div>

        <div className="bg-card rounded-2xl p-5 border border-border shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-amber-500/10 text-amber-600 rounded-lg">
              <FileEdit className="w-5 h-5" />
            </div>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Drafts</p>
          </div>
          <p className="text-3xl font-black text-foreground">{draftCount}</p>
        </div>

        <div className="bg-card rounded-2xl p-5 border border-border shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-500/10 text-blue-600 rounded-lg">
              <MessageSquareQuote className="w-5 h-5" />
            </div>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Corrections</p>
          </div>
          <p className="text-3xl font-black text-foreground">{completedCount}</p>
        </div>
      </div>

      {/* Controls: Search */}
      <div className="bg-card rounded-2xl p-4 border border-border shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
        <h2 className="text-lg font-bold text-foreground">Writing Tests</h2>

        <div className="relative w-full md:w-72 shrink-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search tests by title or prompt..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-muted/30 border border-border rounded-xl text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/50 transition-all"
          />
        </div>
      </div>

      {/* Test Grid */}
      {filteredTests.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredTests.map((test) => (
            <WritingTestCard
              key={test.id}
              test={test}
              status={isClient ? statuses[test.id] : "Not Started"}
            />
          ))}
        </div>
      ) : (
        <div className="col-span-full py-16 text-center bg-card rounded-2xl border border-dashed border-border p-8">
          <Inbox className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-bold text-foreground mb-2">
            {searchQuery ? "No tests found" : "No Writing Practices Available"}
          </h3>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            {searchQuery
              ? "No writing tests matched your search terms."
              : "Writing practice tests configured by your teacher or admin will appear here."}
          </p>
        </div>
      )}
    </div>
  );
}
