import clsx from "clsx";
import type { BadgeProps } from "./types";

export const Badge = ({
  children,
  variant = "default",
  size = "md",
  appearance = "default",
  className,
  ...rest
}: BadgeProps) => {
  // New badge styles matching the redesign
  const variantClass = {
    default: "bg-slate-50 text-slate-700 border-slate-200 outline-slate-100",
    primary:
      "bg-indigo-50 text-indigo-700 border-indigo-200 outline-indigo-100",
    secondary: "bg-slate-50 text-slate-700 border-slate-200 outline-slate-100",
    accent: "bg-pink-50 text-pink-700 border-pink-200 outline-pink-100",
    info: "bg-blue-50 text-blue-700 border-blue-200 outline-blue-100",
    success:
      "bg-emerald-50 text-emerald-700 border-emerald-200 outline-emerald-100",
    warning: "bg-amber-50 text-amber-700 border-amber-200 outline-amber-100",
    error: "bg-red-50 text-red-700 border-red-200 outline-red-100",
  }[variant];

  const sizeClass = {
    xs: "text-[11px] px-2 py-0.5",
    sm: "text-xs px-2 py-0.5",
    md: "text-xs px-2.5 py-1",
    lg: "text-sm px-3 py-1.5",
    xl: "text-base px-4 py-2",
  }[size];

  const appearanceClass = {
    default: "",
    outline: "outline outline-2 outline-offset-1",
    dash: "bg-transparent border-2 border-dashed border-current",
    soft: "outline outline-2 outline-offset-1",
    ghost: "bg-transparent",
  }[appearance];

  // For soft appearance, use lighter opacity
  const isSoft = appearance === "soft";

  return (
    <div
      className={clsx(
        "inline-flex items-center font-bold tracking-wide border shadow-sm capitalize",
        variantClass,
        sizeClass,
        appearanceClass,
        isSoft && variantClass.replace("/60", "/40"),
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
};
