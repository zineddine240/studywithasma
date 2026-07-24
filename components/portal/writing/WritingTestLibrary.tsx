"use client";

import { useState, useEffect } from "react";
import { Search, PenTool, CheckCircle2, FileEdit, MessageSquareQuote } from "lucide-react";
import { writingTests, TaskType, WritingTestStatus } from "@/lib/mock/writing-tests";
import { getWritingStatus } from "@/lib/storage/writing-storage";
import { WritingTestCard } from "./WritingTestCard";

type FilterTab = "All Tests" | TaskType;

export function WritingTestLibrary() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<FilterTab>("All Tests");
  const [statuses, setStatuses] = useState<Record<string, WritingTestStatus>>({});
  const [isClient, setIsClient] = useState(false);

  // Load statuses on client mount to avoid hydration mismatch
  useEffect(() => {
    const loadedStatuses: Record<string, WritingTestStatus> = {};
    writingTests.forEach(test => {
      loadedStatuses[test.id] = getWritingStatus(test.id);
    });
    setStatuses(loadedStatuses);
    setIsClient(true);
  }, []);

  // Filter logic
  const filteredTests = writingTests.filter(test => {
    const matchesTab = activeTab === "All Tests" || test.taskType === activeTab;
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = 
      test.title.toLowerCase().includes(searchLower) ||
      test.topicSummary.toLowerCase().includes(searchLower) ||
      test.taskType.toLowerCase().includes(searchLower);
    
    return matchesTab && matchesSearch;
  });

  // Calculate statistics safely
  const totalTests = writingTests.length;
  const completedCount = isClient ? Object.values(statuses).filter(s => s === "Completed").length : 0;
  const draftCount = isClient ? Object.values(statuses).filter(s => s === "Draft").length : 0;

  return (
    <div className="space-y-8">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-card rounded-2xl p-5 border border-border shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/10 text-primary rounded-lg">
              <PenTool className="w-5 h-5" />
            </div>
            <p className="text-sm font-bold text-muted-foreground uppercase tracking-wide">Total Tests</p>
          </div>
          <p className="text-3xl font-black text-foreground">{totalTests}</p>
        </div>
        
        <div className="bg-card rounded-2xl p-5 border border-border shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-emerald-500/10 text-emerald-600 rounded-lg">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <p className="text-sm font-bold text-muted-foreground uppercase tracking-wide">Completed</p>
          </div>
          <p className="text-3xl font-black text-foreground">{completedCount}</p>
        </div>
        
        <div className="bg-card rounded-2xl p-5 border border-border shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-amber-500/10 text-amber-600 rounded-lg">
              <FileEdit className="w-5 h-5" />
            </div>
            <p className="text-sm font-bold text-muted-foreground uppercase tracking-wide">Drafts</p>
          </div>
          <p className="text-3xl font-black text-foreground">{draftCount}</p>
        </div>
        
        <div className="bg-card rounded-2xl p-5 border border-border shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-500/10 text-blue-600 rounded-lg">
              <MessageSquareQuote className="w-5 h-5" />
            </div>
            <p className="text-sm font-bold text-muted-foreground uppercase tracking-wide">Corrections</p>
          </div>
          <p className="text-3xl font-black text-foreground">{completedCount}</p> {/* 1:1 mapping for mock */}
        </div>
      </div>

      {/* Controls: Search and Filter */}
      <div className="bg-card rounded-2xl p-4 border border-border shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
        
        <div className="flex overflow-x-auto w-full md:w-auto gap-2 pb-2 md:pb-0 hide-scrollbar">
          {(["All Tests", "Academic Task 1", "General Task 1", "Task 2"] as FilterTab[]).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-colors ${
                activeTab === tab 
                  ? "bg-primary text-white shadow-sm" 
                  : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-64 shrink-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search tests..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-muted/30 border border-border rounded-xl text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/50 transition-all"
          />
        </div>
      </div>

      {/* Test Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredTests.length > 0 ? (
          filteredTests.map(test => (
            <WritingTestCard 
              key={test.id} 
              test={test} 
              status={isClient ? statuses[test.id] : "Not Started"} 
            />
          ))
        ) : (
          <div className="col-span-full py-12 text-center text-muted-foreground">
            No tests found matching your search criteria.
          </div>
        )}
      </div>
    </div>
  );
}
