interface EmptyStateProps {
  title: string;
  description: string;
}

export default function EmptyState({
  title,
  description,
}: EmptyStateProps) {
  return (
    <div className="py-16 text-center">
      <h2 className="text-2xl font-semibold text-slate-800">
        {title}
      </h2>

      <p className="mt-2 text-slate-500">
        {description}
      </p>
    </div>
  );
}