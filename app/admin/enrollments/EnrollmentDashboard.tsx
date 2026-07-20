"use client";

import { useState } from "react";
import { format } from "date-fns";
import {
  Check,
  X,
  Eye,
  Edit,
  UserPlus,
  UserX,
  Phone,
  Globe,
  Award,
  BookOpen,
  Calendar,
  CreditCard,
  MessageSquare,
  Group,
  Search,
} from "lucide-react";
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
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

const DURATION_OPTIONS = [
  { value: "1", label: "1 Month" },
  { value: "3", label: "3 Months" },
  { value: "6", label: "6 Months" },
  { value: "permanent", label: "Permanent / No Expiry" },
];

const EDIT_DURATION_OPTIONS = [
  { value: "keep", label: "Keep Current Expiry" },
  { value: "1", label: "+1 Month from Today" },
  { value: "3", label: "+3 Months from Today" },
  { value: "6", label: "+6 Months from Today" },
  { value: "permanent", label: "Permanent / No Expiry" },
];
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  approveEnrollment,
  rejectEnrollment,
  updateEnrollmentAction,
  revokeEnrollmentAction,
  createDirectEnrollmentAction,
} from "./actions";

interface EnrollmentRequest {
  id: string;
  student_id: string;
  course_id: string;
  current_english_level?: string;
  target_band?: string;
  reason?: string;
  additional_message?: string;
  status: string;
  expires_at?: string;
  created_at: string;
  student?: {
    id: string;
    full_name: string;
    email: string;
    phone?: string;
    country?: string;
    target_band?: string;
    group_name?: string;
    enrollment_expiry?: string;
    is_enrolled?: boolean;
  };
  course?: {
    id: string;
    title: string;
    badge?: string;
  };
}

interface CourseItem {
  id: string;
  title: string;
  badge?: string;
}

interface StudentItem {
  id: string;
  full_name: string;
  email: string;
  is_enrolled?: boolean;
  enrolled_course_id?: string;
  target_band?: string;
  group_name?: string;
}

export default function EnrollmentDashboard({
  initialRequests,
  courses = [],
  allStudents = [],
}: {
  initialRequests: any[];
  courses?: CourseItem[];
  allStudents?: StudentItem[];
}) {
  const [requests, setRequests] = useState<EnrollmentRequest[]>(initialRequests);
  const [selectedRequest, setSelectedRequest] = useState<EnrollmentRequest | null>(null);

  // Modals state
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isApproveOpen, setIsApproveOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDirectEnrollOpen, setIsDirectEnrollOpen] = useState(false);
  const [isRevokeOpen, setIsRevokeOpen] = useState(false);

  // Form states for Approve / Edit
  const [editCourseId, setEditCourseId] = useState("");
  const [editTargetBand, setEditTargetBand] = useState("");
  const [editGroupName, setEditGroupName] = useState("");
  const [duration, setDuration] = useState<number | "permanent" | "keep">(1);
  const [paymentNotes, setPaymentNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Direct Enroll Form state
  const [directStudentId, setDirectStudentId] = useState("");
  const [directCourseId, setDirectCourseId] = useState("");
  const [directTargetBand, setDirectTargetBand] = useState("6.5");
  const [directGroupName, setDirectGroupName] = useState("Self-Paced");
  const [directDuration, setDirectDuration] = useState<number | "permanent">(1);
  const [directNotes, setDirectNotes] = useState("");
  const [studentSearch, setStudentSearch] = useState("");

  // Helper to check if enrollment is expired
  const isEnrollmentExpired = (req: EnrollmentRequest): boolean => {
    if (req.status !== "approved") return false;
    const expiry = req.expires_at || req.student?.enrollment_expiry;
    if (!expiry) return false;
    return new Date(expiry) < new Date();
  };

  // Search/Filter requests list
  const [filterStatus, setFilterStatus] = useState("all");

  const filteredRequests = requests.filter((r) => {
    if (filterStatus === "all") return true;
    if (filterStatus === "pending") return r.status === "pending";
    if (filterStatus === "approved") return r.status === "approved" && !isEnrollmentExpired(r);
    if (filterStatus === "expired") return isEnrollmentExpired(r);
    if (filterStatus === "rejected") return r.status === "rejected";
    return true;
  });

  const getTabCount = (tab: string) => {
    if (tab === "all") return requests.length;
    if (tab === "pending") return requests.filter((r) => r.status === "pending").length;
    if (tab === "approved") return requests.filter((r) => r.status === "approved" && !isEnrollmentExpired(r)).length;
    if (tab === "expired") return requests.filter((r) => isEnrollmentExpired(r)).length;
    if (tab === "rejected") return requests.filter((r) => r.status === "rejected").length;
    return 0;
  };

  // Open Edit Modal
  const openEditModal = (req: EnrollmentRequest) => {
    setSelectedRequest(req);
    setEditCourseId(req.course_id || (courses[0]?.id ?? ""));
    setEditTargetBand(req.target_band || req.student?.target_band || "6.5");
    setEditGroupName(req.student?.group_name || "Self-Paced");
    setDuration(isEnrollmentExpired(req) ? 1 : "keep");
    setPaymentNotes("");
    setIsEditOpen(true);
  };

  // Open View Modal
  const openViewModal = (req: EnrollmentRequest) => {
    setSelectedRequest(req);
    setIsViewOpen(true);
  };

  // Open Revoke Modal
  const openRevokeModal = (req: EnrollmentRequest) => {
    setSelectedRequest(req);
    setIsRevokeOpen(true);
  };

  // Submit Approval
  const handleApprove = async () => {
    if (!selectedRequest) return;
    setIsSubmitting(true);
    try {
      const res = await approveEnrollment(
        selectedRequest.id,
        selectedRequest.student_id,
        selectedRequest.course_id,
        selectedRequest.target_band || "6.5",
        duration === "keep" ? 1 : duration,
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

  // Submit Rejection
  const handleReject = async (requestId: string) => {
    if (!confirm("Are you sure you want to reject this request?")) return;
    try {
      const res = await rejectEnrollment(requestId);
      if (res.error) throw new Error(res.error);

      toast.success("Enrollment request rejected.");
      setRequests((prev) =>
        prev.map((r) => (r.id === requestId ? { ...r, status: "rejected" } : r))
      );
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  // Submit Edit Update
  const handleEditSubmit = async () => {
    if (!selectedRequest) return;
    setIsSubmitting(true);
    try {
      const res = await updateEnrollmentAction(
        selectedRequest.id,
        selectedRequest.student_id,
        editCourseId,
        editTargetBand,
        editGroupName,
        duration,
        paymentNotes
      );
      if (res.error) throw new Error(res.error);

      toast.success("Enrollment updated successfully!");
      const selectedCourse = courses.find((c) => c.id === editCourseId);
      setRequests((prev) =>
        prev.map((r) => {
          if (r.id !== selectedRequest.id) return r;
          return {
            ...r,
            course_id: editCourseId,
            target_band: editTargetBand,
            course: selectedCourse ? { id: selectedCourse.id, title: selectedCourse.title, badge: selectedCourse.badge || "" } : r.course,
            student: r.student ? { ...r.student, group_name: editGroupName, target_band: editTargetBand } : r.student,
          };
        })
      );
      setIsEditOpen(false);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Submit Revoke Access
  const handleRevokeSubmit = async () => {
    if (!selectedRequest) return;
    setIsSubmitting(true);
    try {
      const res = await revokeEnrollmentAction(selectedRequest.id, selectedRequest.student_id);
      if (res.error) throw new Error(res.error);

      toast.success("Student access revoked.");
      setRequests((prev) =>
        prev.map((r) => (r.id === selectedRequest.id ? { ...r, status: "rejected" } : r))
      );
      setIsRevokeOpen(false);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Submit Direct Manual Enrollment
  const handleDirectEnrollSubmit = async () => {
    if (!directStudentId || !directCourseId) {
      toast.error("Please select both a student and a course.");
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await createDirectEnrollmentAction(
        directStudentId,
        directCourseId,
        directTargetBand,
        directGroupName,
        directDuration,
        directNotes
      );
      if (res.error) throw new Error(res.error);

      toast.success("Student enrolled directly!");
      setIsDirectEnrollOpen(false);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredStudents = allStudents.filter(
    (s) =>
      s.email.toLowerCase().includes(studentSearch.toLowerCase()) ||
      (s.full_name && s.full_name.toLowerCase().includes(studentSearch.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Header & Main Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            Enrollment Requests
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage student course registrations, view profiles, and edit access.
          </p>
        </div>

        <Button
          onClick={() => {
            setDirectStudentId(allStudents[0]?.id || "");
            setDirectCourseId(courses[0]?.id || "");
            setIsDirectEnrollOpen(true);
          }}
          className="font-bold flex items-center gap-2"
        >
          <UserPlus className="w-4 h-4" />
          Direct Enroll Student
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-border pb-3">
        {["all", "pending", "approved", "expired", "rejected"].map((st) => (
          <button
            key={st}
            onClick={() => setFilterStatus(st)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold capitalize transition-colors ${
              filterStatus === st
                ? "bg-primary text-white"
                : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            {st} ({getTabCount(st)})
          </button>
        ))}
      </div>

      {/* Table Container */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
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
            {filteredRequests.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  No enrollment requests found.
                </TableCell>
              </TableRow>
            ) : (
              filteredRequests.map((request) => {
                const isExpired = isEnrollmentExpired(request);

                return (
                  <TableRow key={request.id}>
                    <TableCell>
                      <div className="font-bold text-foreground">
                        {request.student?.full_name || "Unknown Student"}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {request.student?.email}
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="font-bold text-foreground">{request.course?.title || "Course"}</div>
                      <div className="text-xs text-muted-foreground">
                        Target: Band {request.target_band || request.student?.target_band || "6.5"}
                      </div>
                    </TableCell>

                    <TableCell className="text-sm font-medium text-muted-foreground">
                      {format(new Date(request.created_at), "MMM d, yyyy")}
                    </TableCell>

                    <TableCell>
                      {isExpired ? (
                        <Badge
                          variant="outline"
                          className="font-bold px-2.5 py-0.5 border-amber-500/50 text-amber-600 bg-amber-500/10 dark:text-amber-400"
                        >
                          Expired
                        </Badge>
                      ) : (
                        <Badge
                          variant={
                            request.status === "approved"
                              ? "default"
                              : request.status === "rejected"
                              ? "destructive"
                              : "secondary"
                          }
                          className="font-bold px-2.5 py-0.5"
                        >
                          {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                        </Badge>
                      )}
                    </TableCell>

                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* View Button */}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openViewModal(request)}
                          className="h-8 px-2 text-xs font-bold flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          View
                        </Button>

                        {/* Pending: Approve / Reject */}
                        {request.status === "pending" && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedRequest(request);
                                setIsApproveOpen(true);
                              }}
                              className="h-8 px-2 text-xs font-bold text-emerald-600 border-emerald-200 hover:bg-emerald-50 dark:hover:bg-emerald-950/20"
                            >
                              <Check className="w-3.5 h-3.5 mr-0.5" />
                              Approve
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleReject(request.id)}
                              className="h-8 px-2 text-xs text-destructive hover:bg-destructive/10"
                            >
                              <X className="w-3.5 h-3.5" />
                            </Button>
                          </>
                        )}

                        {/* Approved / Expired: Edit or Renew / Revoke */}
                        {request.status === "approved" && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openEditModal(request)}
                              className={`h-8 px-2 text-xs font-bold ${
                                isExpired
                                  ? "text-amber-600 border-amber-300 hover:bg-amber-50 dark:text-amber-400 dark:border-amber-700 dark:hover:bg-amber-950/30"
                                  : "text-primary border-primary/20 hover:bg-primary/10"
                              }`}
                            >
                              <Edit className="w-3.5 h-3.5 mr-1" />
                              {isExpired ? "Renew Access" : "Edit"}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openRevokeModal(request)}
                              className="h-8 px-2 text-xs text-destructive hover:bg-destructive/10"
                              title="Revoke Access"
                            >
                              <UserX className="w-3.5 h-3.5" />
                            </Button>
                          </>
                        )}

                        {/* Rejected: Allow Rollback / Re-Approve */}
                        {request.status === "rejected" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedRequest(request);
                              setIsApproveOpen(true);
                            }}
                            className="h-8 px-2 text-xs font-bold text-emerald-600 border-emerald-200 hover:bg-emerald-50 dark:hover:bg-emerald-950/20"
                          >
                            <Check className="w-3.5 h-3.5 mr-0.5" />
                            Approve
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* ── VIEW MODAL ── */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Enrollment Details</DialogTitle>
            <DialogDescription>
              Complete dossier for {selectedRequest?.student?.full_name}
            </DialogDescription>
          </DialogHeader>

          {selectedRequest && (
            <div className="space-y-4 py-2 text-sm">
              <div className="bg-muted/50 p-4 rounded-xl border border-border space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-foreground text-base">
                    {selectedRequest.student?.full_name}
                  </span>
                  <Badge variant={selectedRequest.status === "approved" ? "default" : "secondary"}>
                    {selectedRequest.status.toUpperCase()}
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-primary" />
                    <span>{selectedRequest.student?.country || "Not specified"}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-primary" />
                    <span>{selectedRequest.student?.phone || "Not specified"}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2.5">
                <div className="flex items-center justify-between p-3 rounded-lg bg-card border border-border">
                  <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-primary" />
                    Course
                  </span>
                  <span className="font-bold text-foreground">{selectedRequest.course?.title}</span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-card border border-border">
                  <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-primary" />
                    Target Band
                  </span>
                  <span className="font-bold text-foreground">Band {selectedRequest.target_band || "6.5"}</span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-card border border-border">
                  <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                    <Group className="w-4 h-4 text-primary" />
                    Group Batch
                  </span>
                  <span className="font-bold text-foreground">{selectedRequest.student?.group_name || "Self-Paced"}</span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-card border border-border">
                  <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-primary" />
                    Access Expiry
                  </span>
                  <span className="font-bold text-foreground">
                    {selectedRequest.student?.enrollment_expiry
                      ? format(new Date(selectedRequest.student.enrollment_expiry), "MMM d, yyyy")
                      : "Permanent / No Expiry"}
                  </span>
                </div>
              </div>

              {selectedRequest.reason && (
                <div className="p-3 rounded-lg bg-muted/30 border border-border">
                  <p className="text-xs font-bold text-muted-foreground mb-1 flex items-center gap-1">
                    <MessageSquare className="w-3.5 h-3.5 text-primary" />
                    Reason for joining
                  </p>
                  <p className="text-xs text-foreground leading-relaxed">{selectedRequest.reason}</p>
                </div>
              )}

              {selectedRequest.additional_message && (
                <div className="p-3 rounded-lg bg-muted/30 border border-border">
                  <p className="text-xs font-bold text-muted-foreground mb-1 flex items-center gap-1">
                    <CreditCard className="w-3.5 h-3.5 text-primary" />
                    Notes / Message
                  </p>
                  <p className="text-xs text-foreground leading-relaxed">{selectedRequest.additional_message}</p>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── APPROVE MODAL ── */}
      <Dialog open={isApproveOpen} onOpenChange={setIsApproveOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve Enrollment</DialogTitle>
            <DialogDescription>
              Grant access to {selectedRequest?.student?.full_name} for{" "}
              <span className="font-bold text-foreground">
                {selectedRequest?.course?.title}
              </span>.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-muted-foreground uppercase">Access Duration</label>
              <Select
                value={String(duration)}
                onValueChange={(val) =>
                  setDuration(val === "permanent" ? "permanent" : Number(val) || 1)
                }
              >
                <SelectTrigger className="h-11 rounded-xl">
                  <SelectValue placeholder="Select access duration">
                    {DURATION_OPTIONS.find((opt) => opt.value === String(duration))?.label}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {DURATION_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-muted-foreground uppercase">Payment Notes (Internal)</label>
              <Textarea
                placeholder="E.g., Paid via CCP on Jul 20, receipt #12345"
                value={paymentNotes}
                onChange={(e) => setPaymentNotes(e.target.value)}
                rows={3}
                className="resize-none"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsApproveOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleApprove} disabled={isSubmitting} className="font-bold">
              {isSubmitting ? "Approving..." : "Confirm Approval"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── EDIT MODAL ── */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Edit Enrollment</DialogTitle>
            <DialogDescription>
              Update course, group, target band or access duration for {selectedRequest?.student?.full_name}.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-muted-foreground uppercase">Assigned Course</label>
              <Select
                value={editCourseId}
                onValueChange={(val) => val && setEditCourseId(val)}
              >
                <SelectTrigger className="h-11 rounded-xl">
                  <SelectValue placeholder="Select course">
                    {courses.find((c) => c.id === editCourseId)?.title}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {courses.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-muted-foreground uppercase">Target Band</label>
                <Input
                  value={editTargetBand}
                  onChange={(e) => setEditTargetBand(e.target.value)}
                  placeholder="6.5"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-muted-foreground uppercase">Group Batch</label>
                <Input
                  value={editGroupName}
                  onChange={(e) => setEditGroupName(e.target.value)}
                  placeholder="Self-Paced"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-muted-foreground uppercase">Extend / Reset Expiry</label>
              <Select
                value={String(duration)}
                onValueChange={(val) =>
                  setDuration(
                    val === "keep"
                      ? "keep"
                      : val === "permanent"
                      ? "permanent"
                      : Number(val) || "keep"
                  )
                }
              >
                <SelectTrigger className="h-11 rounded-xl">
                  <SelectValue placeholder="Select duration action">
                    {EDIT_DURATION_OPTIONS.find((opt) => opt.value === String(duration))?.label}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {EDIT_DURATION_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-muted-foreground uppercase">Update Payment Notes</label>
              <Textarea
                placeholder="Update receipt or payment details..."
                value={paymentNotes}
                onChange={(e) => setPaymentNotes(e.target.value)}
                rows={3}
                className="resize-none"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditSubmit} disabled={isSubmitting} className="font-bold">
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── REVOKE MODAL ── */}
      <Dialog open={isRevokeOpen} onOpenChange={setIsRevokeOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-destructive flex items-center gap-2">
              <UserX className="w-5 h-5" />
              Revoke Student Access
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to revoke course access for{" "}
              <span className="font-bold text-foreground">
                {selectedRequest?.student?.full_name}
              </span>? They will no longer be able to view course materials or live classes.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setIsRevokeOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleRevokeSubmit} disabled={isSubmitting} className="font-bold">
              {isSubmitting ? "Revoking..." : "Confirm Revoke"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── DIRECT MANUAL ENROLLMENT MODAL ── */}
      <Dialog open={isDirectEnrollOpen} onOpenChange={setIsDirectEnrollOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-primary" />
              Direct Student Enrollment
            </DialogTitle>
            <DialogDescription>
              Manually enroll any registered student directly without waiting for a request form.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {/* Student Search & Select */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-muted-foreground uppercase">Select Registered Student</label>
              <Select
                value={directStudentId}
                onValueChange={(val) => val && setDirectStudentId(val)}
              >
                <SelectTrigger className="h-11 rounded-xl">
                  <SelectValue placeholder="Select student by name or email...">
                    {(() => {
                      const s = allStudents.find((st) => st.id === directStudentId);
                      if (!s) return undefined;
                      return `${s.full_name || "No name"} (${s.email})${s.is_enrolled ? " • [Enrolled]" : ""}`;
                    })()}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {allStudents.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.full_name || "No name"} ({s.email}) {s.is_enrolled ? "• [Enrolled]" : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Select Course */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-muted-foreground uppercase">Target Course</label>
              <Select
                value={directCourseId}
                onValueChange={(val) => val && setDirectCourseId(val)}
              >
                <SelectTrigger className="h-11 rounded-xl">
                  <SelectValue placeholder="Select course">
                    {courses.find((c) => c.id === directCourseId)?.title}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {courses.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-muted-foreground uppercase">Target Band</label>
                <Input
                  value={directTargetBand}
                  onChange={(e) => setDirectTargetBand(e.target.value)}
                  placeholder="6.5"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-muted-foreground uppercase">Group Batch</label>
                <Input
                  value={directGroupName}
                  onChange={(e) => setDirectGroupName(e.target.value)}
                  placeholder="Self-Paced"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-muted-foreground uppercase">Access Duration</label>
              <Select
                value={String(directDuration)}
                onValueChange={(val) =>
                  setDirectDuration(val === "permanent" ? "permanent" : Number(val) || 1)
                }
              >
                <SelectTrigger className="h-11 rounded-xl">
                  <SelectValue placeholder="Select access duration">
                    {DURATION_OPTIONS.find((opt) => opt.value === String(directDuration))?.label}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {DURATION_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-muted-foreground uppercase">Payment Notes (Internal)</label>
              <Textarea
                placeholder="E.g. Bank transfer receipt #456..."
                value={directNotes}
                onChange={(e) => setDirectNotes(e.target.value)}
                rows={3}
                className="resize-none"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDirectEnrollOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleDirectEnrollSubmit} disabled={isSubmitting} className="font-bold">
              {isSubmitting ? "Enrolling..." : "Enroll Student"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
