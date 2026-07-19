"use client";

import { useState } from "react";
import { AdminSidebar } from "./AdminSidebar";
import { AdminHeader } from "./AdminHeader";

export function AdminLayoutClient({
  children,
  email,
  fullName,
  unreadContactCount = 0,
}: {
  children: React.ReactNode;
  email?: string;
  fullName?: string | null;
  unreadContactCount?: number;
}) {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <AdminSidebar isExpanded={isSidebarExpanded} setIsExpanded={setIsSidebarExpanded} unreadContactCount={unreadContactCount} />
      
      <main className="flex-1 flex flex-col min-h-0 overflow-hidden relative">
        <AdminHeader 
          email={email}
          fullName={fullName}
          isExpanded={isSidebarExpanded} 
          setIsExpanded={setIsSidebarExpanded} 
        />
        
        <div className="flex-1 overflow-auto w-full custom-scrollbar">
          <div className="p-6 sm:p-8 max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
