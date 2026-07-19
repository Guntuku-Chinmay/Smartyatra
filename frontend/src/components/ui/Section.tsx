import { ReactNode } from "react";

interface SectionProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
}

export default function Section({
  title,
  subtitle,
  children,
}: SectionProps) {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <div className="mb-12 text-center">
        <h2 className="text-4xl font-bold">
          {title}
        </h2>

        {subtitle && (
          <p className="mt-4 text-slate-600">
            {subtitle}
          </p>
        )}
      </div>

      {children}
    </section>
  );
}