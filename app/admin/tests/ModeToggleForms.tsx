"use client";

import { useState } from "react";
import { Sparkles, PenTool, Upload } from "lucide-react";
import GenerateTestForm from "./GenerateTestForm";
import ManualTestForm from "./ManualTestForm";
import DocumentUploadTestForm from "./DocumentUploadTestForm";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ModeToggleForms() {
  const [activeTab, setActiveTab] = useState<string>("ai");
  const [manualInitialData, setManualInitialData] = useState<any | null>(null);

  const handlePayloadGenerated = (payload: any, type: string) => {
    const formattedData = {
      title: payload.title || "AI Generated Test",
      content_type: type,
      content_data: payload,
    };
    setManualInitialData(formattedData);
    setActiveTab("manual");
  };

  return (
    <div className="w-full space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        {/* Full-width tab bar */}
        <TabsList className="w-full h-10 mb-6">
          <TabsTrigger value="ai" className="flex-1 gap-2 text-sm font-semibold">
            <Sparkles className="w-4 h-4" />
            AI Prompt
          </TabsTrigger>
          <TabsTrigger value="upload" className="flex-1 gap-2 text-sm font-semibold">
            <Upload className="w-4 h-4" />
            Upload Document AI
          </TabsTrigger>
          <TabsTrigger value="manual" className="flex-1 gap-2 text-sm font-semibold flex items-center justify-center">
            <PenTool className="w-4 h-4" />
            Manual Creation
            {manualInitialData && (
              <span className="ml-1.5 w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            )}
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Tab Contents rendered with CSS visibility so active form state is NEVER lost on tab switch */}
      <div className={activeTab === "ai" ? "block animate-in fade-in duration-200" : "hidden"}>
        <GenerateTestForm />
      </div>

      <div className={activeTab === "upload" ? "block animate-in fade-in duration-200" : "hidden"}>
        <DocumentUploadTestForm onPayloadGenerated={handlePayloadGenerated} />
      </div>

      <div className={activeTab === "manual" ? "block animate-in fade-in duration-200" : "hidden"}>
        <ManualTestForm
          key={manualInitialData ? JSON.stringify(manualInitialData.title) + manualInitialData.content_type : "default-manual"}
          initialData={manualInitialData}
        />
      </div>
    </div>
  );
}
