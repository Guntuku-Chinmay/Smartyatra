import { ReactNode } from "react";

interface CardProps {
  title: string;
  children: ReactNode;
}

export default function Card({
  title,
  children,
}: CardProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm transition hover:shadow-lg">
      <h3 className="mb-4 text-2xl font-bold">
        {title}
      </h3>

      <div className="text-slate-600">
        {children}
      </div>
    </div>
  );
}