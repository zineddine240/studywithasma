"use client";

import * as React from "react";
import { format } from "date-fns";
import { CalendarIcon, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";

interface DateTimePickerProps {
  value?: string; // ISO string or ""
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function DateTimePicker({
  value,
  onChange,
  placeholder = "Pick date and time",
  disabled,
}: DateTimePickerProps) {
  const [open, setOpen] = React.useState(false);

  // Parse existing value
  const parsed = value ? new Date(value) : undefined;
  const selectedDate = parsed && !isNaN(parsed.getTime()) ? parsed : undefined;

  // Time state derived from selected date
  const [timeStr, setTimeStr] = React.useState<string>(() => {
    if (selectedDate) {
      const h = String(selectedDate.getHours()).padStart(2, "0");
      const m = String(selectedDate.getMinutes()).padStart(2, "0");
      return `${h}:${m}`;
    }
    return "09:00";
  });

  const handleDaySelect = (day: Date | undefined) => {
    if (!day) return;
    const [h, m] = timeStr.split(":").map(Number);
    const combined = new Date(day);
    combined.setHours(h ?? 0, m ?? 0, 0, 0);
    // Format as local datetime string compatible with datetime-local (YYYY-MM-DDTHH:mm)
    const iso = format(combined, "yyyy-MM-dd'T'HH:mm");
    onChange(iso);
    setOpen(false);
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = e.target.value;
    setTimeStr(newTime);
    if (selectedDate) {
      const [h, m] = newTime.split(":").map(Number);
      const combined = new Date(selectedDate);
      combined.setHours(h ?? 0, m ?? 0, 0, 0);
      onChange(format(combined, "yyyy-MM-dd'T'HH:mm"));
    }
  };

  const displayLabel = selectedDate
    ? `${format(selectedDate, "PPP")} at ${timeStr}`
    : placeholder;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        disabled={disabled}
        className={cn(
          "flex h-9 w-full items-center justify-start gap-2 rounded-lg border border-input bg-transparent px-3 py-2 text-sm transition-colors outline-none",
          "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
          "disabled:cursor-not-allowed disabled:opacity-50 dark:bg-input/30",
          !selectedDate && "text-muted-foreground"
        )}
      >
        <CalendarIcon className="size-4 shrink-0 text-muted-foreground" />
        <span className="flex-1 truncate text-left">{displayLabel}</span>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={handleDaySelect}
          disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
        />
        {/* Time picker row */}
        <div className="border-t border-border px-4 py-3 flex items-center gap-3">
          <Clock className="size-4 text-muted-foreground shrink-0" />
          <label className="text-sm font-medium text-foreground">Time</label>
          <Input
            type="time"
            value={timeStr}
            onChange={handleTimeChange}
            className="h-8 w-32 text-sm"
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}
