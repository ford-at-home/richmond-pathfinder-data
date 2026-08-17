import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";

import { PageHeader, ProseContainer } from "@/components/page/PageHeader";
import { supabase } from "@/integrations/supabase/client";

const feedbackSchema = z.object({
  name: z.string().trim().max(120, "Name must be 120 characters or fewer").optional(),
  email: z
    .union([z.string().trim().email("Enter a valid email address").max(254), z.literal("")])
    .optional(),
  message: z
    .string()
    .trim()
    .min(1, "Please write a message")
    .max(4000, "Message must be 4000 characters or fewer"),
});

export const Route = createFileRoute("/feedback")({
  head: () => ({
    meta: [
      { title: "Feedback — Richmond Workforce Transition" },
      {
        name: "description",
        content:
          "Send a correction, question, or comment about the Richmond VA MSA workforce transition data.",
      },
      { property: "og:title", content: "Feedback — Richmond Workforce Transition" },
      {
        property: "og:description",
        content: "Send a correction, question, or comment about this public-interest data project.",
      },
    ],
  }),
  component: FeedbackPage,
});

type Status = "idle" | "submitting" | "sent" | "error";

function FeedbackPage() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const form = event.currentTarget;
    const data = new FormData(form);
    const parsed = feedbackSchema.safeParse({
      name: String(data.get("name") ?? ""),
      email: String(data.get("email") ?? ""),
      message: String(data.get("message") ?? ""),
    });

    if (!parsed.success) {
      setStatus("error");
      setError(parsed.error.issues[0]?.message ?? "Please check the form and try again.");
      return;
    }

    setStatus("submitting");
    const { error: insertError } = await supabase.from("feedback").insert({
      name: parsed.data.name ? parsed.data.name : null,
      email: parsed.data.email ? parsed.data.email : null,
      message: parsed.data.message,
      page_path: typeof window === "undefined" ? null : window.location.pathname,
    });

    if (insertError) {
      setStatus("error");
      setError("Something went wrong sending your feedback. Please try again.");
      return;
    }

    form.reset();
    setStatus("sent");
  }

  return (
    <main id="main">
      <PageHeader
        eyebrow="Contact"
        title="Feedback"
        lead="Corrections, questions, and comments about the data or the interface. Every note is read; contact details are optional."
      />
      <ProseContainer>
        <form onSubmit={handleSubmit} className="mt-8 max-w-xl space-y-6" noValidate>
          <div>
            <label htmlFor="feedback-name" className="label-sm block">
              Name <span className="annotation">(optional)</span>
            </label>
            <input
              id="feedback-name"
              name="name"
              type="text"
              maxLength={120}
              autoComplete="name"
              className="mt-2 w-full border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div>
            <label htmlFor="feedback-email" className="label-sm block">
              Email <span className="annotation">(optional, only if you want a reply)</span>
            </label>
            <input
              id="feedback-email"
              name="email"
              type="email"
              maxLength={254}
              autoComplete="email"
              className="mt-2 w-full border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div>
            <label htmlFor="feedback-message" className="label-sm block">
              Message
            </label>
            <textarea
              id="feedback-message"
              name="message"
              required
              rows={7}
              maxLength={4000}
              aria-describedby="feedback-status"
              className="mt-2 w-full border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="flex items-center gap-4">
            <button
              type="submit"
              disabled={status === "submitting"}
              className="border-2 border-foreground bg-foreground px-5 py-2 text-sm font-medium text-background transition-colors hover:bg-background hover:text-foreground disabled:opacity-60"
            >
              {status === "submitting" ? "Sending…" : "Send feedback"}
            </button>
            <p id="feedback-status" role="status" aria-live="polite" className="annotation">
              {status === "sent" ? "Thank you — your feedback was received." : null}
              {status === "error" ? error : null}
            </p>
          </div>
        </form>

        <p className="mt-8 max-w-xl annotation">
          Data provenance: submissions are stored in this project&apos;s database and are not
          published on the site. Providing a name or email is optional.
        </p>
      </ProseContainer>
    </main>
  );
}
