"use client";

import { Sparkles, PenTool } from "lucide-react";
import GenerateTestForm from "./GenerateTestForm";
import ManualTestForm from "./ManualTestForm";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export default function ModeToggleForms() {
  return (
    <Tabs defaultValue="ai" className="w-full">
      {/* Full-width tab bar */}
      <TabsList className="w-full h-10 mb-6">
        <TabsTrigger value="ai" className="flex-1 gap-2 text-sm font-semibold">
          <Sparkles className="w-4 h-4" />
          AI Generation
        </TabsTrigger>
        <TabsTrigger value="manual" className="flex-1 gap-2 text-sm font-semibold">
          <PenTool className="w-4 h-4" />
          Manual Creation
        </TabsTrigger>
      </TabsList>

      <TabsContent value="ai" className="animate-in fade-in slide-in-from-bottom-2 duration-200">
        <GenerateTestForm />
      </TabsContent>

      <TabsContent value="manual" className="animate-in fade-in slide-in-from-bottom-2 duration-200">
        <ManualTestForm />
      </TabsContent>
    </Tabs>
  );
}
