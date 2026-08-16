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
    <header className={cn("border-b-[5px] border-foreground pb-8 pt-10 md:pt-14", className)}>
      {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
      <h1 className="mt-3 page-title">{title}</h1>
      {lead ? <p className="mt-5 section-lead max-w-[66ch]">{lead}</p> : null}
      {meta && meta.length > 0 ? (
        <dl className="mt-8 grid grid-cols-2 border-t border-border md:grid-cols-4">
          {meta.map((m) => (
            <div key={m.label} className="border-r border-border px-4 py-3 last:border-r-0">
              <dt className="label-sm">{m.label}</dt>
              <dd className="mt-1.5 text-sm text-foreground">{m.value}</dd>
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
        "mx-auto w-full px-8",
        width === "narrow" && "max-w-[46rem]",
        width === "default" && "max-w-[1280px]",
        width === "wide" && "max-w-[1280px]",
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
      <As className="mt-2 font-serif text-[20px] font-normal leading-[1.55] tracking-normal text-foreground">
        {title}
      </As>
      {lead ? (
        <p className="mt-3 font-serif text-[17px] leading-6 text-muted-foreground">{lead}</p>
      ) : null}
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
