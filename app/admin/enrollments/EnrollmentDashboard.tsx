"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Check, X, Eye, Clock } from "lucide-react";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { approveEnrollment, rejectEnrollment } from "./actions";

interface EnrollmentRequest {
  id: string;
  student_id: string;
  course_id: string;
  current_english_level: string;
  target_band: string;
  reason: string;
  additional_message: string;
  status: string;
  created_at: string;
  student: {
    full_name: string;
    email: string;
    phone: string;
    country: string;
  };
  course: {
    title: string;
    badge: string;
  };
}

export default function EnrollmentDashboard({
  initialRequests,
}: {
  initialRequests: any[];
}) {
  const [requests, setRequests] = useState<EnrollmentRequest[]>(initialRequests);
  const [selectedRequest, setSelectedRequest] = useState<EnrollmentRequest | null>(null);
  const [isApproveOpen, setIsApproveOpen] = useState(false);
  const [duration, setDuration] = useState<number | "permanent">(1);
  const [paymentNotes, setPaymentNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleApprove = async () => {
    if (!selectedRequest) return;
    setIsSubmitting(true);
    try {
      const res = await approveEnrollment(
        selectedRequest.id,
        selectedRequest.student_id,
        selectedRequest.course_id,
        selectedRequest.target_band,
        duration,
        paymentNotes
      );
      if (res.error) throw new Error(res.error);

      toast.success("Enrollment approved successfully!");
      setRequests((prev) =>
        prev.map((r) =>
          r.id === selectedRequest.id ? { ...r, status: "approved" } : r
        )
      );
      setIsApproveOpen(false);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReject = async (requestId: string) => {
    if (!confirm("Are you sure you want to reject this request?")) return;
    try {
      const res = await rejectEnrollment(requestId);
      if (res.error) throw new Error(res.error);

      toast.success("Enrollment rejected.");
      setRequests((prev) =>
        prev.map((r) => (r.id === requestId ? { ...r, status: "rejected" } : r))
      );
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div className="space-y-4">
      <div className="rounded-md border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student</TableHead>
              <TableHead>Course</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  No enrollment requests found.
                </TableCell>
              </TableRow>
            ) : (
              requests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell>
                    <div className="font-medium text-foreground">
                      {request.student?.full_name || "Unknown"}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {request.student?.email}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{request.course?.title}</div>
                    <div className="text-xs text-muted-foreground">
                      Target: {request.target_band}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">
                    {format(new Date(request.created_at), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        request.status === "approved"
                          ? "default"
                          : request.status === "rejected"
                          ? "destructive"
                          : "secondary"
                      }
                    >
                      {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {request.status === "pending" && (
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedRequest(request);
                            setIsApproveOpen(true);
                          }}
                        >
                          <Check className="w-4 h-4 mr-1 text-emerald-500" />
                          Approve
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleReject(request.id)}
                        >
                          <X className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    )}
                    {request.status !== "pending" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                           // Could open a view modal, for now just log or do nothing.
                           setSelectedRequest(request);
                        }}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Approve Modal */}
      <Dialog open={isApproveOpen} onOpenChange={setIsApproveOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve Enrollment</DialogTitle>
            <DialogDescription>
              Grant access to {selectedRequest?.student?.full_name} for{" "}
              <span className="font-medium text-foreground">
                {selectedRequest?.course?.title}
              </span>.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Display full info just for review */}
            <div className="text-sm bg-muted/50 p-4 rounded-lg space-y-2">
              <p><strong>Phone:</strong> {selectedRequest?.student?.phone}</p>
              <p><strong>Country:</strong> {selectedRequest?.student?.country}</p>
              <p><strong>Current Level:</strong> {selectedRequest?.current_english_level}</p>
              <p><strong>Reason:</strong> {selectedRequest?.reason}</p>
              {selectedRequest?.additional_message && (
                <p><strong>Message:</strong> {selectedRequest?.additional_message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Access Duration</label>
              <select
                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                value={duration}
                onChange={(e) =>
                  setDuration(
                    e.target.value === "permanent" ? "permanent" : Number(e.target.value)
                  )
                }
              >
                <option value={1}>1 Month</option>
                <option value={3}>3 Months</option>
                <option value={6}>6 Months</option>
                <option value="permanent">Permanent / No Expiry</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Payment Notes (Internal)</label>
              <Textarea
                placeholder="E.g., Paid via CCP on..."
                value={paymentNotes}
                onChange={(e) => setPaymentNotes(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsApproveOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleApprove} disabled={isSubmitting}>
              {isSubmitting ? "Approving..." : "Confirm Approval"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
