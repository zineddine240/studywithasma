"use client";

import { useState, useEffect } from "react";
import { PortalSidebar } from "./PortalSidebar";
import { PortalTopBar } from "./PortalTopBar";

export function PortalLayoutClient({
  children,
  userEmail,
}: {
  children: React.ReactNode;
  userEmail?: string;
}) {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileMenuOpen]);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <PortalSidebar 
        isExpanded={isSidebarExpanded} 
        setIsExpanded={setIsSidebarExpanded}
        isOpen={mobileMenuOpen}
        setIsOpen={setMobileMenuOpen}
      />
      
      <main className="flex-1 flex flex-col min-h-0 overflow-hidden relative">
        <PortalTopBar 
          onOpenSidebar={() => setMobileMenuOpen(true)} 
          userEmail={userEmail}
          isExpanded={isSidebarExpanded}
          setIsExpanded={setIsSidebarExpanded}
        />
        
        <div className="flex-1 overflow-auto w-full custom-scrollbar">
          <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
