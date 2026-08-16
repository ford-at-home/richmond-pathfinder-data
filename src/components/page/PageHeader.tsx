import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export function PageHeader({
  eyebrow,
  title,
  lead,
  meta,
  children,
  className,
}: {
  eyebrow?: string | undefined;
  title: string;
  lead?: string | undefined;
  meta?: { label: string; value: string }[] | undefined;
  children?: ReactNode | undefined;
  className?: string | undefined;
}) {
  return (
    <header className={cn("border-b border-rule pb-8 pt-10 md:pt-14", className)}>
      {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
      <h1 className="mt-3 page-title max-w-4xl text-balance">{title}</h1>
      {lead ? <p className="mt-5 section-lead max-w-2xl">{lead}</p> : null}
      {meta && meta.length > 0 ? (
        <dl className="mt-7 flex flex-wrap gap-x-10 gap-y-3">
          {meta.map((m) => (
            <div key={m.label}>
              <dt className="label-sm">{m.label}</dt>
              <dd className="mt-1 text-sm text-foreground">{m.value}</dd>
            </div>
          ))}
        </dl>
      ) : null}
      {children}
    </header>
  );
}

export function ProseContainer({
  children,
  className,
  width = "default",
}: {
  children: ReactNode;
  className?: string | undefined;
  width?: "default" | "narrow" | "wide" | undefined;
}) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-5 lg:px-8",
        width === "narrow" && "max-w-[46rem]",
        width === "default" && "max-w-[80rem]",
        width === "wide" && "max-w-[92rem]",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function SectionIntro({
  eyebrow,
  title,
  lead,
  as: As = "h2",
  className,
  children,
}: {
  eyebrow?: string | undefined;
  title: string;
  lead?: string | undefined;
  as?: "h2" | "h3" | undefined;
  className?: string | undefined;
  children?: ReactNode | undefined;
}) {
  return (
    <div className={cn("max-w-2xl", className)}>
      {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
      <As className="mt-2 font-display text-2xl leading-tight text-foreground md:text-[1.75rem]">
        {title}
      </As>
      {lead ? <p className="mt-3 text-[0.95rem] leading-relaxed text-muted-foreground">{lead}</p> : null}
      {children}
    </div>
  );
}

export function PageSection({
  children,
  className,
  id,
  labelledBy,
}: {
  children: ReactNode;
  className?: string | undefined;
  id?: string | undefined;
  labelledBy?: string | undefined;
}) {
  return (
    <section id={id} aria-labelledby={labelledBy} className={cn("py-12 md:py-16", className)}>
      {children}
    </section>
  );
}
