"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { CTAButton } from "@/components/ui/CTAButton";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().min(7, "Please enter a valid phone number"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactFormValues = z.infer<typeof contactSchema>;

const inputClass =
  "bg-surface-elevated text-text-primary placeholder:text-text-muted focus-visible:ring-linear-accent";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle"
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormValues) => {
    setStatus("loading");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed");
      setStatus("success");
      reset();
    } catch {
      setStatus("error");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {(["name", "email", "phone"] as const).map((field) => (
        <div key={field} className="space-y-2">
          <Label htmlFor={field} className="text-text-secondary capitalize">
            {field}
          </Label>
          <Input
            id={field}
            type={field === "email" ? "email" : field === "phone" ? "tel" : "text"}
            {...register(field)}
            className={inputClass}
          />
          {errors[field] && (
            <p className="text-xs text-red-400">{errors[field]?.message}</p>
          )}
        </div>
      ))}
      <div className="space-y-2">
        <Label htmlFor="message" className="text-text-secondary">
          Message
        </Label>
        <Textarea
          id="message"
          rows={4}
          {...register("message")}
          className={inputClass}
          placeholder="Which route are you considering?"
        />
        {errors.message && (
          <p className="text-xs text-red-400">{errors.message.message}</p>
        )}
      </div>
      <CTAButton type="submit" disabled={status === "loading"}>
        {status === "loading" ? "Sending..." : "Send message"}
      </CTAButton>
      {status === "success" && (
        <p className="text-xs text-green-400">We&apos;ll be in touch within 48 hours.</p>
      )}
      {status === "error" && (
        <p className="text-xs text-red-400">Something went wrong. Email us directly.</p>
      )}
    </form>
  );
}
