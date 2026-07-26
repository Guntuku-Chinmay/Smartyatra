export default function Skeleton({
  className = "",
  variant = "rect",
}: {
  className?: string;
  variant?: "rect" | "circle" | "text";
}) {
  const rounded = {
    rect: "rounded-xl",
    circle: "rounded-full",
    text: "rounded-md h-4 w-full",
  };

  return (
    <div
      className={`animate-pulse bg-slate-100/80 ${rounded[variant]} ${className}`}
      style={{
        backgroundImage: "linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%)",
        backgroundSize: "200% 100%",
        animation: "shimmer 1.5s infinite linear",
      }}
    />
  );
}
