"use client";

import { useEffect, useState, useRef } from "react";
import { getPendingJobs, processJob, clearPendingQueue } from "@/app/admin/tests/queue-actions";
import { Loader2, Sparkles, X } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function BackgroundQueueWorker() {
  const [pendingCount, setPendingCount] = useState(0);
  const [totalSessionJobs, setTotalSessionJobs] = useState(0);
  const [processedSessionJobs, setProcessedSessionJobs] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentJobName, setCurrentJobName] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  
  const processingRef = useRef(false);

  useEffect(() => {
    // Initial fetch
    checkQueue();

    // Poll every 10 seconds if idle
    const interval = setInterval(() => {
      if (!processingRef.current) {
        checkQueue();
      }
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const checkQueue = async () => {
    if (processingRef.current) return;

    try {
      const { jobs, count } = await getPendingJobs();
      const activeCount = count || 0;
      setPendingCount(activeCount);

      if (activeCount > 0) {
        // If we just discovered jobs and weren't tracking a session, initialize totals
        if (totalSessionJobs === 0) {
          setTotalSessionJobs(activeCount);
          setProcessedSessionJobs(0);
        } else if (activeCount > (totalSessionJobs - processedSessionJobs)) {
          // If the pending count suddenly grew (user uploaded more files), expand the session total
          setTotalSessionJobs(processedSessionJobs + activeCount);
        }
        
        if (jobs.length > 0) {
          processNextJob(jobs[0]);
        }
      } else {
        // Queue is empty, reset session trackers
        setTotalSessionJobs(0);
        setProcessedSessionJobs(0);
      }
    } catch (err) {
      console.error("Failed to check queue", err);
    }
  };

  const processNextJob = async (job: any) => {
    if (processingRef.current) return;
    
    processingRef.current = true;
    setIsProcessing(true);
    setCurrentJobName(job.original_filename);

    let res: any;
    let delay = 5000; // 5-second delay to respect 15 RPM free tier limit
    
    try {
      res = await processJob(job.id);
      
      if (res?.isRateLimit) {
        delay = 20000; // Wait 20 seconds if we hit a rate limit
        setStatusMessage("Rate limit reached. Waiting 20s...");
      } else if (res?.error) {
        toast.error(`Generation failed for ${job.original_filename}: ${res.error}`, { duration: 5000 });
        setProcessedSessionJobs(prev => prev + 1);
        setStatusMessage("");
      } else {
        toast.success(`Successfully generated test from ${job.original_filename}!`, { duration: 4000 });
        setProcessedSessionJobs(prev => prev + 1);
        setStatusMessage("");
      }
    } catch (err: any) {
      toast.error(`Unexpected error generating test from ${job.original_filename}.`, { duration: 5000 });
      setProcessedSessionJobs(prev => prev + 1);
    } finally {
      setIsProcessing(false);
      setCurrentJobName("");
      
      // Delay before next check
      setTimeout(() => {
        processingRef.current = false;
        checkQueue();
      }, delay);
    }
  };

  const handleCancelQueue = async (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    
    setIsCancelling(true);
    try {
      const res = await clearPendingQueue();
      if (res.error) {
        toast.error(`Failed to cancel: ${res.error}`);
      } else {
        toast.success("Remaining queue has been cancelled.");
        setPendingCount(0);
        setTotalSessionJobs(0);
        setProcessedSessionJobs(0);
        setIsExpanded(false);
        setIsCancelDialogOpen(false);
      }
    } catch (err) {
      toast.error("An error occurred while cancelling.");
    } finally {
      setIsCancelling(false);
    }
  };

  if (pendingCount === 0 && !isProcessing) {
    return null; // Hidden when idle
  }

  const progressPercent = totalSessionJobs > 0 
    ? Math.min(Math.round((processedSessionJobs / totalSessionJobs) * 100), 100) 
    : 0;

  if (!isExpanded) {
    return (
      <button 
        onClick={() => setIsExpanded(true)}
        className="fixed bottom-6 right-6 z-50 animate-in zoom-in slide-in-from-bottom-4 w-12 h-12 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center hover:scale-105 transition-transform"
        title="View Generation Progress"
      >
        <Loader2 className="w-6 h-6 animate-spin" />
        {/* Optional small badge for progress */}
        {totalSessionJobs > 0 && (
          <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
            {totalSessionJobs - processedSessionJobs}
          </span>
        )}
      </button>
    );
  }

  return (
    <div 
      className="fixed bottom-6 right-6 z-50 animate-in zoom-in slide-in-from-bottom-4 cursor-pointer"
      onClick={() => setIsExpanded(false)}
    >
      <div className="bg-background border shadow-xl rounded-2xl p-4 flex flex-col gap-3 min-w-[280px] hover:border-primary/50 transition-colors">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <Loader2 className="w-4 h-4 text-primary animate-spin" />
          </div>
          <div className="flex flex-col flex-1 min-w-0">
            <p className="text-sm font-semibold flex items-center justify-between gap-1.5">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-primary" />
                AI Generating Tests
              </span>
              <span className="text-xs text-muted-foreground font-medium">
                {processedSessionJobs}/{totalSessionJobs}
              </span>
            </p>
            <p className="text-xs text-muted-foreground truncate" title={currentJobName}>
              {statusMessage ? (
                <span className="text-amber-500 font-medium">{statusMessage}</span>
              ) : (
                currentJobName ? `Processing: ${currentJobName}` : "Checking queue..."
              )}
            </p>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary transition-all duration-500 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Cancel Button */}
        {totalSessionJobs - processedSessionJobs > 0 && (
          <Dialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
            <DialogTrigger
              render={
                <button
                  disabled={isCancelling}
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center justify-center gap-2 w-full py-1.5 mt-1 text-xs font-medium text-destructive hover:bg-destructive/10 rounded-md transition-colors disabled:opacity-50"
                />
              }
            >
              {isCancelling ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <X className="w-3.5 h-3.5" />
              )}
              Cancel Remaining
            </DialogTrigger>
            
            <DialogContent onClick={(e) => e.stopPropagation()}>
              <DialogHeader>
                <DialogTitle>Cancel Remaining Queue?</DialogTitle>
                <DialogDescription>
                  This will immediately cancel all pending tests in the queue. Any test currently generating will finish.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsCancelDialogOpen(false);
                  }}
                  className="px-4 py-2 text-sm font-medium rounded-md border hover:bg-muted"
                >
                  Keep Queue
                </button>
                <button
                  onClick={(e) => handleCancelQueue(e)}
                  className="px-4 py-2 text-sm font-medium rounded-md bg-destructive text-destructive-foreground hover:bg-destructive/90 flex items-center justify-center gap-2"
                >
                  {isCancelling && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  Yes, Cancel
                </button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
}
