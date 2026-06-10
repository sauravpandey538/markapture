"use client";

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Calendar, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { CTAButton } from "@/components/ui/CTAButton";
import { getBookableDays } from "@/lib/booking";
import { cn } from "@/lib/utils";

const MAX_RESUME_SIZE = 5 * 1024 * 1024;

const consultationSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().min(7, "Please enter a valid phone number"),
  description: z
    .string()
    .min(20, "Please describe your goals (at least 20 characters)"),
});

type ConsultationFormValues = z.infer<typeof consultationSchema>;

const inputClass =
  "bg-surface-elevated text-text-primary placeholder:text-text-muted focus-visible:ring-linear-accent";

export function ConsultationBookingForm() {
  const bookableDays = useMemo(() => getBookableDays(14), []);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle"
  );
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeError, setResumeError] = useState<string | null>(null);

  const activeDay = bookableDays.find((d) => d.date === selectedDate);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ConsultationFormValues>({
    resolver: zodResolver(consultationSchema),
  });

  const onSubmit = async (data: ConsultationFormValues) => {
    setResumeError(null);

    if (!selectedDate || !selectedSlot) return;
    if (!resumeFile) {
      setResumeError("Please upload your resume or CV");
      return;
    }
    if (resumeFile.size > MAX_RESUME_SIZE) {
      setResumeError("Resume must be under 5 MB");
      return;
    }

    setStatus("loading");
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("email", data.email);
      formData.append("phone", data.phone);
      formData.append("date", selectedDate);
      formData.append("timeSlot", `${activeDay?.weekday} ${selectedSlot}`);
      formData.append("description", data.description);
      formData.append("resume", resumeFile);

      const response = await fetch("/api/consultation", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) throw new Error("Failed");
      setStatus("success");
      reset();
      setResumeFile(null);
      setSelectedDate(null);
      setSelectedSlot(null);
    } catch {
      setStatus("error");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Step 1 — Date */}
      <div>
        <div className="mb-4 flex items-center gap-2">
          <span className="flex size-6 items-center justify-center rounded-full bg-linear-accent text-xs font-semibold text-white">
            1
          </span>
          <Label className="flex items-center gap-2 text-text-primary">
            <Calendar className="size-3.5 text-linear-accent" />
            Choose a date
          </Label>
        </div>
        <div className="scroll-strip pb-3 pt-1">
          <div className="flex w-max gap-2 px-1">
            {bookableDays.map((day) => (
              <button
                key={day.date}
                type="button"
                onClick={() => {
                  setSelectedDate(day.date);
                  setSelectedSlot(null);
                }}
                className={cn(
                  "flex min-w-[4.75rem] shrink-0 flex-col items-center rounded-xl px-3.5 py-3 text-center transition-all",
                  selectedDate === day.date
                    ? "bg-linear-accent text-white shadow-[0_0_20px_rgba(94,106,210,0.35)]"
                    : "bg-surface-elevated text-text-secondary shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)] hover:text-text-primary"
                )}
              >
                <span className="text-[10px] font-medium uppercase tracking-wide">
                  {day.weekday}
                </span>
                <span className="mt-0.5 text-sm font-semibold">{day.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Step 2 — Time slots (only after date) */}
      {activeDay && (
        <div>
          <div className="mb-4 flex items-center gap-2">
            <span className="flex size-6 items-center justify-center rounded-full bg-linear-accent text-xs font-semibold text-white">
              2
            </span>
            <Label className="flex items-center gap-2 text-text-primary">
              <Clock className="size-3.5 text-linear-accent" />
              Available slots — {activeDay.weekday} {activeDay.label}
            </Label>
          </div>
          <div className="flex flex-wrap gap-2">
            {activeDay.slots.map((slot) => (
              <button
                key={slot}
                type="button"
                onClick={() => setSelectedSlot(slot)}
                className={cn(
                  "rounded-lg px-4 py-2 text-sm transition-all",
                  selectedSlot === slot
                    ? "bg-linear-accent text-white"
                    : "bg-surface-elevated text-text-secondary hover:text-text-primary"
                )}
              >
                {slot} UK
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 3 — Details (only after slot) */}
      {selectedDate && selectedSlot && (
        <div className="space-y-5 border-t border-white/[0.06] pt-8">
          <div className="flex items-center gap-2">
            <span className="flex size-6 items-center justify-center rounded-full bg-linear-accent text-xs font-semibold text-white">
              3
            </span>
            <p className="text-sm font-medium text-text-primary">Your details</p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Full name" id="consult-name" error={errors.name?.message}>
              <Input id="consult-name" {...register("name")} className={inputClass} placeholder="Your name" />
            </Field>
            <Field label="Email" id="consult-email" error={errors.email?.message}>
              <Input id="consult-email" type="email" {...register("email")} className={inputClass} placeholder="you@email.com" />
            </Field>
          </div>
          <Field label="Phone" id="consult-phone" error={errors.phone?.message}>
            <Input id="consult-phone" type="tel" {...register("phone")} className={inputClass} placeholder="+44 ..." />
          </Field>
          <Field label="Resume / CV" id="consult-resume" error={resumeError ?? undefined}>
            <Input
              id="consult-resume"
              type="file"
              accept=".pdf,.doc,.docx"
              className={inputClass}
              onChange={(e) => {
                setResumeError(null);
                setResumeFile(e.target.files?.[0] ?? null);
              }}
            />
            <p className="text-[11px] text-text-muted">PDF or Word, max 5 MB</p>
          </Field>
          <Field label="Your goals & background" id="consult-desc" error={errors.description?.message}>
            <Textarea
              id="consult-desc"
              rows={4}
              {...register("description")}
              className={inputClass}
              placeholder="Which route are you considering? What's your professional background?"
            />
          </Field>

          <div className="rounded-lg bg-surface-elevated px-4 py-3 text-xs text-text-secondary">
            Booking: <span className="text-text-primary">{activeDay?.weekday} {activeDay?.label}</span>
            {" · "}
            <span className="text-text-primary">{selectedSlot} UK</span>
          </div>

          <CTAButton type="submit" disabled={status === "loading"}>
            {status === "loading" ? "Booking..." : "Confirm booking"}
          </CTAButton>
          {status === "success" && (
            <p className="text-xs text-green-400">
              Booked! Confirmation email within 24 hours.
            </p>
          )}
          {status === "error" && (
            <p className="text-xs text-red-400">
              Something went wrong. Try again or email us directly.
            </p>
          )}
        </div>
      )}
    </form>
  );
}

function Field({
  label,
  id,
  error,
  children,
}: {
  label: string;
  id: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-text-secondary">
        {label}
      </Label>
      {children}
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}
