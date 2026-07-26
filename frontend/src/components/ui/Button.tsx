import { ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

export default function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center font-bold transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-500/10 active:scale-95 disabled:opacity-50 disabled:pointer-events-none cursor-pointer rounded-xl";

  const variants = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/10 hover:shadow-blue-500/20",
    secondary: "bg-slate-100 hover:bg-slate-200 text-slate-700",
    outline: "border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 shadow-sm",
    ghost: "hover:bg-slate-100 text-slate-600 hover:text-slate-900",
  };

  const sizes = {
    sm: "px-3.5 py-1.5 text-xs",
    md: "px-5 py-2.5 text-sm",
    lg: "px-7 py-3.5 text-base",
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}