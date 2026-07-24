"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel, FieldContent, FieldError } from "@/components/ui/field";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createLessonAction } from "../../actions";
import Link from "next/link";
import { ArrowLeft, UploadCloud, FileVideo, CheckCircle2, PauseCircle, PlayCircle, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { useEffect, useState, useRef } from "react";
import { createClient } from "@/utils/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import * as tus from "tus-js-client";

const formSchema = z.object({
  title: z.string().min(2, "Title is required").max(100),
  description: z.string().optional(),
  video_url: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  module_id: z.string().optional(),
});

interface ModuleOption {
  id: string;
  name: string;
  course_id: string;
  course_title: string;
}

export default function NewLessonPage() {
  const router = useRouter();
  const [modules, setModules] = useState<ModuleOption[]>([]);
  const [loadingModules, setLoadingModules] = useState(true);
  const [selectedCourseId, setSelectedCourseId] = useState<string>("global");
  
  const [activeTab, setActiveTab] = useState<string>("upload");
  
  // Upload State
  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<"idle" | "preparing" | "uploading" | "paused" | "processing" | "ready" | "failed">("idle");
  const uploadRef = useRef<tus.Upload | null>(null);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [savedVideoId, setSavedVideoId] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { title: "", description: "", video_url: "", module_id: "none" },
  });

  const watchModuleId = watch("module_id");
  const watchTitle = watch("title");
  const watchDesc = watch("description");
  const watchUrl = watch("video_url");

  useEffect(() => {
    const supabase = createClient();
    async function fetchModules() {
      try {
        const { data, error } = await supabase.from("modules").select(`id, name, course_id, course:courses (title)`);
        if (data && !error) {
          const formatted = data.map((item: any) => ({
            id: item.id,
            name: item.name,
            course_id: item.course_id,
            course_title: item.course?.title || "Unknown Course"
          }));
          setModules(formatted);
        }
      } catch (err) { console.error(err); } 
      finally { setLoadingModules(false); }
    }
    fetchModules();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      if (!selected.type.startsWith("video/")) {
        toast.error("Please select a valid video file.");
        return;
      }
      setFile(selected);
      setUploadStatus("idle");
      setUploadProgress(0);
    }
  };

  const startBunnyUpload = async () => {
    if (!file) return;
    if (!watchTitle) {
      toast.error("Please enter a title first.");
      return;
    }
    setUploadStatus("preparing");

    try {
      // 1. Get Secure Upload Credentials
      const credsRes = await fetch("/api/admin/bunny/upload-credentials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: watchTitle })
      });
      
      if (!credsRes.ok) throw new Error("Failed to get upload credentials");
      const creds = await credsRes.json();
      
      // 2. Start TUS Upload
      const upload = new tus.Upload(file, {
        endpoint: creds.uploadEndpoint,
        retryDelays: [0, 3000, 5000, 10000, 20000, 60000],
        headers: {
          AuthorizationSignature: creds.authorizationSignature,
          AuthorizationExpire: creds.expirationTime.toString(),
          VideoId: creds.videoId,
          LibraryId: creds.libraryId,
        },
        metadata: {
          filename: file.name,
          filetype: file.type,
        },
        onError: (error) => {
          console.error("Upload failed:", error);
          setUploadStatus("failed");
          toast.error("Upload failed: " + error.message);
        },
        onProgress: (bytesUploaded, bytesTotal) => {
          setUploadStatus("uploading");
          const percentage = ((bytesUploaded / bytesTotal) * 100).toFixed(2);
          setUploadProgress(Number(percentage));
        },
        onSuccess: async () => {
          setUploadStatus("processing");
          toast.success("Upload complete! Processing video...");
          setSavedVideoId(creds.videoId);
          
          // Save the lesson in the DB as processing
          await saveLessonToDB({
            provider: "bunny",
            libraryId: creds.libraryId,
            videoId: creds.videoId,
            status: "processing"
          });

          // Start polling status
          pollVideoStatus(creds.videoId);
        },
      });

      uploadRef.current = upload;
      upload.start();

    } catch (e: any) {
      setUploadStatus("failed");
      toast.error(e.message || "Failed to start upload");
    }
  };

  const pollVideoStatus = async (videoId: string) => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/admin/bunny/videos/${videoId}/status`);
        if (res.ok) {
          const data = await res.json();
          setProcessingProgress(data.encodeProgress || 0);
          
          // 3 = Finished, 4 = Resolution Finished, 5 = Failed
          if (data.status === 3 || data.status === 4) {
            setUploadStatus("ready");
            clearInterval(interval);
            toast.success("Video processing complete! Lesson is ready.");
          } else if (data.status === 5) {
            setUploadStatus("failed");
            clearInterval(interval);
            toast.error("Video encoding failed.");
          }
        }
      } catch (err) {
        console.error("Polling error", err);
      }
    }, 5000);
  };

  const togglePauseResume = () => {
    if (!uploadRef.current) return;
    if (uploadStatus === "uploading") {
      uploadRef.current.abort();
      setUploadStatus("paused");
    } else if (uploadStatus === "paused") {
      uploadRef.current.start();
      setUploadStatus("uploading");
    }
  };

  const saveLessonToDB = async (bunnyData?: any) => {
    const formData = new FormData();
    formData.append("title", watchTitle);
    if (watchDesc) formData.append("description", watchDesc);
    
    if (watchModuleId && watchModuleId !== "none" && selectedCourseId !== "global") {
      formData.append("module_id", watchModuleId);
    }
    if (selectedCourseId && selectedCourseId !== "global") {
      formData.append("course_id", selectedCourseId);
    }

    if (bunnyData) {
      formData.append("video_provider", "bunny");
      formData.append("bunny_library_id", bunnyData.libraryId);
      formData.append("bunny_video_id", bunnyData.videoId);
      formData.append("video_status", bunnyData.status);
    } else {
      if (!watchUrl) throw new Error("Video URL is required for external videos.");
      formData.append("video_provider", "external");
      formData.append("video_url", watchUrl);
      formData.append("video_status", "ready");
    }

    const result = await createLessonAction(formData);
    if (result.error) throw new Error(result.error);
    return true;
  };

  const onExternalSubmit = async () => {
    try {
      if (!watchTitle || !watchUrl) {
        toast.error("Title and Video URL are required");
        return;
      }
      await saveLessonToDB();
      toast.success("Lesson published successfully!");
      router.push("/admin/lessons");
    } catch (e: any) {
      toast.error(e.message || "An error occurred");
    }
  };

  const uniqueCourses = Array.from(new Map(modules.map((m) => [m.course_id, { id: m.course_id, title: m.course_title }])).values());

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/lessons" className="p-2 hover:bg-muted rounded-full transition-colors">
          <ArrowLeft className="w-5 h-5 text-muted-foreground" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Add Recorded Lesson</h1>
          <p className="text-sm text-muted-foreground">Upload a video or provide an external link.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3">
          <div className="bg-card border border-border rounded-xl p-6 sm:p-8">
            <div className="space-y-6">
              
              {/* Shared Metadata Fields */}
              <div className="space-y-4 border-b border-border pb-6">
                <Field>
                  <FieldLabel htmlFor="title">Lesson Title</FieldLabel>
                  <FieldContent><Input id="title" placeholder="e.g., Fundamentals of Writing" {...register("title")} /></FieldContent>
                </Field>

                <Field>
                  <FieldLabel>Course</FieldLabel>
                  <FieldContent>
                    <Select value={selectedCourseId} onValueChange={(val) => { setSelectedCourseId(val || "global"); setValue("module_id", "none"); }} disabled={loadingModules}>
                      <SelectTrigger>
                        <SelectValue placeholder="-- Select Course --" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="global">-- None (Global Lesson) --</SelectItem>
                        {uniqueCourses.map((c) => (<SelectItem key={c.id} value={c.id}>{c.title}</SelectItem>))}
                      </SelectContent>
                    </Select>
                  </FieldContent>
                </Field>

                {selectedCourseId && selectedCourseId !== "global" && (
                  <Field>
                    <FieldLabel htmlFor="module_id">Associated Module</FieldLabel>
                    <FieldContent>
                      <Select value={watchModuleId || "none"} onValueChange={(val) => setValue("module_id", val || "none", { shouldValidate: true })} disabled={loadingModules}>
                        <SelectTrigger id="module_id">
                          <SelectValue placeholder="-- Select Module --" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">-- None --</SelectItem>
                          {modules.filter((m) => m.course_id === selectedCourseId).map((m) => (
                            <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FieldContent>
                  </Field>
                )}

                <Field>
                  <FieldLabel htmlFor="description">Description (Optional)</FieldLabel>
                  <FieldContent><Textarea id="description" placeholder="Brief overview..." className="min-h-30" {...register("description")} /></FieldContent>
                </Field>
              </div>

              {/* Video Source Tabs */}
              <Tabs defaultValue="upload" onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="upload">Upload Video (Bunny)</TabsTrigger>
                  <TabsTrigger value="external">External URL</TabsTrigger>
                </TabsList>
                
                {/* UPLOAD TAB */}
                <TabsContent value="upload" className="space-y-4 pt-4">
                  <div className="border-2 border-dashed border-border rounded-xl p-8 text-center bg-slate-50 relative">
                    <input type="file" accept="video/*" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed" disabled={uploadStatus === "uploading" || uploadStatus === "processing"} />
                    <div className="flex flex-col items-center justify-center pointer-events-none">
                      <UploadCloud className="w-12 h-12 text-slate-400 mb-3" />
                      <h3 className="font-semibold text-slate-700">Choose a video file</h3>
                      <p className="text-xs text-slate-500 mt-1 max-w-[250px]">MP4, WebM, MOV. Max size 2GB.</p>
                      {file && (
                        <div className="mt-4 p-3 bg-white rounded-lg border border-border shadow-sm flex items-center gap-3">
                          <FileVideo className="w-5 h-5 text-primary" />
                          <div className="text-left">
                            <p className="text-sm font-medium truncate w-[200px]">{file.name}</p>
                            <p className="text-xs text-slate-500">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Upload Progress UI */}
                  {file && uploadStatus !== "idle" && (
                    <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-border">
                      <div className="flex justify-between items-center text-sm font-medium">
                        <span className="capitalize">{uploadStatus}</span>
                        {uploadStatus === "uploading" || uploadStatus === "paused" ? (
                          <span>{uploadProgress}%</span>
                        ) : uploadStatus === "processing" ? (
                          <span>Encoding: {processingProgress}%</span>
                        ) : uploadStatus === "ready" ? (
                          <span className="text-emerald-600 flex items-center gap-1"><CheckCircle2 className="w-4 h-4"/> Done</span>
                        ) : null}
                      </div>
                      
                      <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-300 ${uploadStatus === "processing" ? "bg-amber-500" : uploadStatus === "ready" ? "bg-emerald-500" : uploadStatus === "failed" ? "bg-rose-500" : "bg-primary"}`} 
                          style={{ width: `${uploadStatus === "processing" || uploadStatus === "ready" ? 100 : uploadProgress}%` }} 
                        />
                      </div>

                      {/* Controls */}
                      <div className="flex gap-2 justify-end mt-2">
                        {(uploadStatus === "uploading" || uploadStatus === "paused") && (
                          <Button size="sm" variant="outline" onClick={togglePauseResume} type="button">
                            {uploadStatus === "uploading" ? <><PauseCircle className="w-4 h-4 mr-2"/> Pause</> : <><PlayCircle className="w-4 h-4 mr-2"/> Resume</>}
                          </Button>
                        )}
                        {uploadStatus === "failed" && (
                          <Button size="sm" variant="default" onClick={startBunnyUpload} type="button">
                            Retry Upload
                          </Button>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="flex justify-end gap-3 pt-4 border-t border-border">
                    <Button type="button" disabled={!file || uploadStatus !== "idle"} onClick={startBunnyUpload} className="cursor-pointer">
                      Start Upload & Save
                    </Button>
                  </div>
                </TabsContent>

                {/* EXTERNAL URL TAB */}
                <TabsContent value="external" className="space-y-4 pt-4">
                  <Field>
                    <FieldLabel htmlFor="video_url">Video URL (YouTube, Vimeo, Drive)</FieldLabel>
                    <FieldContent>
                      <Input id="video_url" type="url" placeholder="https://youtube.com/watch?..." {...register("video_url")} />
                    </FieldContent>
                    <FieldError errors={[errors.video_url]} />
                  </Field>
                  <div className="flex justify-end gap-3 pt-4 border-t border-border">
                    <Button type="button" onClick={onExternalSubmit} disabled={isSubmitting} className="cursor-pointer">
                      Save External Lesson
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>

            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <Card className="rounded-xl border border-border bg-card h-fit">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-foreground">Lesson Guidelines</CardTitle>
              <CardDescription>Tips for uploading and structuring resources</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
              <div className="space-y-1">
                <h4 className="font-semibold text-foreground">Direct Upload</h4>
                <p>Using the Bunny Stream uploader protects your videos from theft and provides lightning-fast streaming worldwide.</p>
              </div>
              <div className="space-y-1">
                <h4 className="font-semibold text-foreground">Processing Time</h4>
                <p>After uploading reaches 100%, the video enters a processing queue to generate 1080p, 720p, and 480p versions. The lesson will be available to students once processing is complete.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
