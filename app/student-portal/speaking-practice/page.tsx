"use client";

import { useState, useRef, useEffect } from "react";
import {
  Mic,
  Square,
  Play,
  Pause,
  Trash2,
  Send,
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  Repeat,
  ListMusic,
  MessageSquareQuote,
  Copy,
} from "lucide-react";
import { PortalCard } from "@/components/portal/shared/PortalCard";
import { SectionHeader } from "@/components/portal/shared/SectionHeader";
import {
  SpeakingPracticeRequest,
  SpeakingCorrectionResponse,
  SpeakingCorrectionSchema,
} from "@/lib/ai/schemas";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getBestSupportedAudioType } from "@/lib/audio";

const PRACTICE_TYPES = [
  "Speaking Part 1",
  "Speaking Part 2",
  "Speaking Part 3",
  "General Conversation",
];

const QUESTIONS: Record<string, string[]> = {
  "Speaking Part 1": [
    "Do you work or are you a student?",
    "What do you enjoy doing in your free time?",
    "Tell me about your hometown.",
    "How often do you use the internet?",
    "What kind of music do you enjoy?",
  ],
  "Speaking Part 2": [
    "Describe a place you enjoy visiting.",
    "Describe a useful skill you would like to learn.",
    "Describe a person who has helped you.",
    "Describe a memorable journey.",
    "Describe an app you use regularly.",
  ],
  "Speaking Part 3": [
    "Why do people enjoy travelling?",
    "How has education changed in recent years?",
    "What makes communication effective?",
    "How has technology changed the way people study?",
    "Should young people learn practical skills at school?",
  ],
  "General Conversation": [
    "What are your goals for improving your English?",
    "How do you usually practice speaking English?",
    "What is your favorite topic to discuss in English?",
  ],
};

const MAX_DURATION_SEC = 180; // 3 minutes

export default function SpeakingPracticePage() {
  // Practice Config
  const [practiceType, setPracticeType] = useState<string>(PRACTICE_TYPES[0]);
  const [question, setQuestion] = useState<string>(
    QUESTIONS[PRACTICE_TYPES[0]][0],
  );

  // Audio Recording State
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [duration, setDuration] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [permissionError, setPermissionError] = useState<string | null>(null);

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [result, setResult] = useState<SpeakingCorrectionResponse | null>(null);

  // Refs
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioPlaybackRef = useRef<HTMLAudioElement | null>(null);

  // Automatically update question when practice type changes
  useEffect(() => {
    setQuestion(QUESTIONS[practiceType][0]);
  }, [practiceType]);

  // Timer logic for recording
  useEffect(() => {
    if (isRecording && !isPaused) {
      timerRef.current = setInterval(() => {
        setDuration((prev) => {
          if (prev >= MAX_DURATION_SEC - 1) {
            stopRecording();
            return MAX_DURATION_SEC;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRecording, isPaused]);

  // Cleanup blob URL on unmount
  useEffect(() => {
    return () => {
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, [audioUrl]);

  // ── Recording Controls ──

  const startRecording = async () => {
    try {
      setPermissionError(null);
      setSubmitError(null);
      setResult(null);

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = getBestSupportedAudioType();

      const mediaRecorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const type = mediaRecorder.mimeType || mimeType;
        const blob = new Blob(chunksRef.current, { type });
        setAudioBlob(blob);
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start(200);
      setIsRecording(true);
      setIsPaused(false);
      setDuration(0);
      setAudioBlob(null);
      if (audioUrl) URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
    } catch (err: any) {
      console.error(err);
      if (
        err.name === "NotAllowedError" ||
        err.name === "PermissionDeniedError"
      ) {
        setPermissionError(
          "Microphone access denied. Please allow microphone access in your browser settings to use this feature.",
        );
      } else {
        setPermissionError(
          err.message ||
            "Could not access the microphone. Please check your hardware or browser support.",
        );
      }
    }
  };

  const pauseRecording = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state === "recording"
    ) {
      mediaRecorderRef.current.pause();
      setIsPaused(true);
    }
  };

  const resumeRecording = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state === "paused"
    ) {
      mediaRecorderRef.current.resume();
      setIsPaused(false);
    }
  };

  const stopRecording = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsPaused(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const deleteRecording = () => {
    setAudioBlob(null);
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioUrl(null);
    setDuration(0);
  };

  // ── Submission ──

  const handleSubmit = async () => {
    if (!audioBlob) return;
    setSubmitError(null);
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("practiceType", practiceType);
      formData.append("question", question);
      formData.append("audio", audioBlob, "recording.webm");

      const res = await fetch("/api/ai/speaking-correction", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to process audio.");
      }

      const rawData = await res.json();
      const parsedData = SpeakingCorrectionSchema.parse(rawData);
      setResult(parsedData);
    } catch (err: any) {
      console.error(err);
      setSubmitError(
        err.message || "An unexpected error occurred. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyTranscript = () => {
    if (result) {
      navigator.clipboard.writeText(result.correctedTranscript);
      alert("Corrected transcript copied to clipboard!");
    }
  };

  const resetPractice = () => {
    setResult(null);
    setSubmitError(null);
    deleteRecording();
  };

  // ── Helpers ──

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-8">
      {/* ── Page Header ── */}
      <section className="bg-card text-white p-6 sm:p-10 rounded-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary rounded-full blur-3xl opacity-30 -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
        <div className="relative z-10">
          <h1 className="text-3xl sm:text-4xl font-extrabold mb-3 tracking-tight">
            Speaking Practice
          </h1>
          <p className="text-primary/70 text-lg max-w-2xl leading-relaxed">
            Record your answer and receive AI-assisted language corrections and
            speaking feedback.
          </p>
        </div>
      </section>

      {/* ── Input & Recording Interface (Hidden when result is showing) ── */}
      {!result && (
        <div className="space-y-6">
          <PortalCard className="space-y-6">
            <SectionHeader
              title="Select Topic"
              icon={<ListMusic className="w-5 h-5" />}
            />

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-foreground mb-2">
                  Practice Type
                </label>
                <Select
                  value={practiceType}
                  onValueChange={(val) => setPracticeType(val || "")}
                  disabled={isRecording || isSubmitting || audioBlob !== null}
                >
                  <SelectTrigger className="w-full h-12.5 px-4 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all bg-card disabled:opacity-50">
                    <SelectValue placeholder="Select practice type" />
                  </SelectTrigger>
                  <SelectContent>
                    {PRACTICE_TYPES.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-bold text-foreground mb-2">
                  Question
                </label>
                <Select
                  value={question}
                  onValueChange={(val) => setQuestion(val || "")}
                  disabled={isRecording || isSubmitting || audioBlob !== null}
                >
                  <SelectTrigger className="w-full h-12.5 px-4 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all bg-card disabled:opacity-50">
                    <SelectValue placeholder="Select question" />
                  </SelectTrigger>
                  <SelectContent>
                    {QUESTIONS[practiceType].map((q) => (
                      <SelectItem key={q} value={q}>
                        {q}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Display large question card */}
            <div className="bg-muted/30 border border-border rounded-2xl p-6 text-center shadow-inner mt-4">
              <span className="text-xs font-bold text-primary uppercase tracking-wider mb-2 block">
                {practiceType}
              </span>
              <h2 className="text-2xl font-bold text-foreground">{question}</h2>
            </div>
          </PortalCard>

          <PortalCard className="space-y-6 text-center py-10">
            {permissionError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-start gap-3 text-left mb-6 mx-auto max-w-2xl">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <p className="font-medium text-sm">{permissionError}</p>
              </div>
            )}

            {submitError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-start gap-3 text-left mb-6 mx-auto max-w-2xl">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <p className="font-medium text-sm">{submitError}</p>
              </div>
            )}

            {!audioBlob && (
              <div className="flex flex-col items-center gap-6">
                {/* Timer Display */}
                <div className="text-5xl font-extrabold tabular-nums tracking-tight text-foreground">
                  {formatTime(duration)}
                </div>

                {isRecording && (
                  <div className="text-sm font-semibold text-rose-500 animate-pulse flex items-center gap-2">
                    <div className="w-2.5 h-2.5 bg-rose-500 rounded-full"></div>
                    Recording... ({MAX_DURATION_SEC - duration}s remaining)
                  </div>
                )}
                {!isRecording && duration > 0 && (
                  <div className="text-sm font-semibold text-amber-500">
                    Paused. Time remaining: {MAX_DURATION_SEC - duration}s
                  </div>
                )}
                {!isRecording && duration === 0 && (
                  <div className="text-sm font-semibold text-muted-foreground">
                    Max duration: 3 minutes. Press record to begin.
                  </div>
                )}

                {/* Controls */}
                <div className="flex items-center gap-4">
                  {!isRecording && duration === 0 && (
                    <button
                      onClick={startRecording}
                      className="w-16 h-16 rounded-full bg-rose-500 hover:bg-rose-600 text-white flex items-center justify-center shadow-lg transition-transform hover:scale-105 active:scale-95"
                    >
                      <Mic className="w-7 h-7" />
                    </button>
                  )}

                  {isRecording && !isPaused && (
                    <>
                      <button
                        onClick={pauseRecording}
                        className="w-14 h-14 rounded-full bg-slate-100 hover:bg-slate-200 text-foreground flex items-center justify-center shadow transition-colors"
                      >
                        <Pause className="w-6 h-6" fill="currentColor" />
                      </button>
                      <button
                        onClick={stopRecording}
                        className="w-16 h-16 rounded-full bg-rose-500 hover:bg-rose-600 text-white flex items-center justify-center shadow-lg transition-transform hover:scale-105 active:scale-95"
                      >
                        <Square className="w-6 h-6" fill="currentColor" />
                      </button>
                    </>
                  )}

                  {!isRecording && duration > 0 && (
                    <>
                      <button
                        onClick={resumeRecording}
                        className="w-14 h-14 rounded-full bg-slate-100 hover:bg-slate-200 text-foreground flex items-center justify-center shadow transition-colors"
                      >
                        <Mic className="w-6 h-6" />
                      </button>
                      <button
                        onClick={stopRecording}
                        className="w-16 h-16 rounded-full bg-rose-500 hover:bg-rose-600 text-white flex items-center justify-center shadow-lg transition-transform hover:scale-105 active:scale-95"
                      >
                        <Square className="w-6 h-6" fill="currentColor" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Audio Preview & Submit */}
            {audioBlob && audioUrl && (
              <div className="flex flex-col items-center gap-6 max-w-xl mx-auto w-full">
                <div className="bg-muted/30 p-6 rounded-2xl border border-border w-full space-y-4">
                  <h3 className="font-bold text-foreground flex items-center gap-2 justify-center">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    Recording Complete ({formatTime(duration)})
                  </h3>
                  <audio
                    ref={audioPlaybackRef}
                    src={audioUrl}
                    controls
                    className="w-full custom-audio-player"
                  />
                </div>

                <div className="flex flex-wrap justify-center gap-4 w-full">
                  <button
                    onClick={deleteRecording}
                    disabled={isSubmitting}
                    className="flex-1 min-w-35 px-6 py-3.5 rounded-xl font-bold bg-card border border-border text-red-600 hover:bg-red-500/10 dark:hover:bg-red-950/20 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <Trash2 className="w-5 h-5" />
                    Delete
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="flex-1 min-w-50 px-6 py-3.5 rounded-xl font-bold bg-primary text-white hover:bg-primary/80 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Submit for Feedback
                      </>
                    )}
                  </button>
                </div>
                <div className="text-xs text-muted-foreground">
                  By submitting, you agree to have your audio processed securely
                  by our AI service. No personal data is included.
                </div>
              </div>
            )}
          </PortalCard>
        </div>
      )}

      {/* ── Results View ── */}
      {result && audioUrl && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="bg-amber-500/10 border border-amber-500/20 text-amber-600 p-4 rounded-xl flex items-start gap-3">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-amber-600 dark:text-amber-500" />
            <p className="text-sm font-medium leading-relaxed">
              <strong>Notice:</strong> AI feedback is provided for speaking
              practice and language learning only. It is not an official IELTS
              assessment or pronunciation score.
            </p>
          </div>

          {/* Original context recap */}
          <PortalCard className="bg-muted/30 border-border">
            <span className="text-xs font-bold text-primary uppercase tracking-wider mb-1 block">
              {practiceType}
            </span>
            <h2 className="text-xl font-bold text-foreground mb-4">
              {question}
            </h2>
            <audio src={audioUrl} controls className="w-full max-w-md h-10" />
          </PortalCard>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Original Transcript */}
            <PortalCard className="bg-muted/50 border-border">
              <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
                <MessageSquareQuote className="w-4 h-4 text-muted-foreground" />
                Your Transcript
              </h3>
              <div className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
                {result.transcript ||
                  "(Audio could not be transcribed properly)"}
              </div>
            </PortalCard>

            {/* Corrected Transcript */}
            <PortalCard className="bg-emerald-500/10 border-emerald-500/20">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  Corrected Transcript
                </h3>
                <button
                  onClick={handleCopyTranscript}
                  className="p-2 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/20 rounded-lg transition-colors"
                  title="Copy Corrected Transcript"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
              <div className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">
                {result.correctedTranscript}
              </div>
            </PortalCard>
          </div>

          {/* Detailed Feedback */}
          <PortalCard>
            <SectionHeader
              title="Language Feedback"
              icon={<ListMusic className="w-5 h-5" />}
            />

            <div className="mt-6 space-y-8">
              {/* Language Corrections */}
              {result.corrections && result.corrections.length > 0 && (
                <div>
                  <h4 className="font-bold text-foreground mb-4 border-b border-[#E5E7EB] pb-2">
                    Mistakes & Corrections
                  </h4>
                  <div className="space-y-4">
                    {result.corrections.map((corr, idx) => (
                      <div
                        key={idx}
                        className="bg-card border border-border rounded-xl p-4"
                      >
                        <div className="flex justify-between items-start gap-4 mb-3">
                          <div className="flex flex-wrap items-center gap-2 text-sm">
                            <span className="line-through text-destructive font-medium bg-destructive/10 px-2 py-0.5 rounded">
                              {corr.originalText}
                            </span>
                            <span className="text-muted-foreground font-bold">
                              →
                            </span>
                            <span className="text-emerald-600 font-bold bg-emerald-500/10 dark:text-emerald-400 px-2 py-0.5 rounded">
                              {corr.correctedText}
                            </span>
                          </div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-muted/30 border border-border px-2 py-1 rounded shrink-0">
                            {corr.category}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {corr.explanation}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Vocabulary Suggestions */}
              {result.vocabularySuggestions &&
                result.vocabularySuggestions.length > 0 && (
                  <div>
                    <h4 className="font-bold text-foreground mb-4 border-b border-[#E5E7EB] pb-2">
                      Vocabulary Suggestions
                    </h4>
                    <div className="space-y-4">
                      {result.vocabularySuggestions.map((vocab, idx) => (
                        <div
                          key={idx}
                          className="bg-muted/30 border border-border rounded-xl p-4"
                        >
                          <div className="flex flex-wrap items-center gap-2 text-sm mb-2">
                            <span className="text-muted-foreground font-medium px-2 py-0.5 bg-card rounded border border-border">
                              {vocab.originalText}
                            </span>
                            <span className="text-muted-foreground font-bold">
                              →
                            </span>
                            <span className="text-primary font-bold px-2 py-0.5 bg-card rounded border border-border">
                              {vocab.suggestedText}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {vocab.explanation}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
            </div>
          </PortalCard>

          {/* Speaking Observations */}
          <PortalCard>
            <SectionHeader
              title="Speaking Observations"
              icon={<Mic className="w-5 h-5" />}
            />
            <div className="mt-6 grid sm:grid-cols-3 gap-6">
              <div>
                <h4 className="font-bold text-foreground mb-3 text-sm">
                  Fluency & Pace
                </h4>
                <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                  {result.fluencyNotes && result.fluencyNotes.length > 0 ? (
                    result.fluencyNotes.map((note, i) => (
                      <li key={i}>{note}</li>
                    ))
                  ) : (
                    <li>No specific notes.</li>
                  )}
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-foreground mb-3 text-sm">
                  Pronunciation & Clarity
                </h4>
                <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                  {result.clarityNotes && result.clarityNotes.length > 0 ? (
                    result.clarityNotes.map((note, i) => (
                      <li key={i}>{note}</li>
                    ))
                  ) : (
                    <li>No specific notes.</li>
                  )}
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-foreground mb-3 text-sm">
                  Task Relevance
                </h4>
                <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                  {result.relevanceNotes && result.relevanceNotes.length > 0 ? (
                    result.relevanceNotes.map((note, i) => (
                      <li key={i}>{note}</li>
                    ))
                  ) : (
                    <li>No specific notes.</li>
                  )}
                </ul>
              </div>
            </div>
          </PortalCard>

          {/* Improved Answer & Follow-ups */}
          <div className="grid lg:grid-cols-3 gap-6">
            <PortalCard className="lg:col-span-2">
              <h4 className="font-bold text-foreground mb-4">
                Improved Example Answer
              </h4>
              <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap bg-card p-4 rounded-xl border border-border">
                {result.improvedAnswer}
              </p>
            </PortalCard>

            <PortalCard>
              <h4 className="font-bold text-foreground mb-4">
                Follow-up Questions
              </h4>
              <ul className="space-y-3">
                {result.followUpQuestions &&
                result.followUpQuestions.length > 0 ? (
                  result.followUpQuestions.map((fq, i) => (
                    <li
                      key={i}
                      className="text-sm font-medium text-primary bg-muted/30 p-3 rounded-lg border border-border"
                    >
                      Q: {fq}
                    </li>
                  ))
                ) : (
                  <li className="text-sm text-muted-foreground">
                    None suggested.
                  </li>
                )}
              </ul>
            </PortalCard>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={resetPractice}
              className="bg-card text-foreground px-6 py-2.5 rounded-xl font-bold border border-border hover:bg-muted transition-colors flex items-center gap-2"
            >
              <Repeat className="w-4 h-4" />
              Practice Again
            </button>
            <button
              disabled
              className="bg-primary text-white px-6 py-2.5 rounded-xl font-bold hover:bg-primary/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              title="Coming Soon"
            >
              Send to Teacher
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
