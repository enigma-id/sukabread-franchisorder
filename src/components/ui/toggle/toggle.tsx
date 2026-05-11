import { useState } from "react";
import clsx from "clsx";
import { Loader2 } from "lucide-react";
import type { ToggleProps } from "./types";

export type { ToggleProps } from "./types";

export const Toggle = ({
  label,
  size = "md",
  variant = "neutral",
  disabled,
  className,
  labelClassName,
  labelPosition = "right",
  checked,
  defaultChecked,
  onChange,
  ...rest
}: ToggleProps & {
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => Promise<void> | void;
}) => {
  const [internalChecked, setInternalChecked] = useState(
    defaultChecked ?? false,
  );
  const [isLoading, setIsLoading] = useState(false);

  const isControlled = checked !== undefined;
  const isChecked = isControlled ? checked : internalChecked;

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled || isLoading) return;

    const newValue = e.target.checked;

    if (!isControlled) {
      setInternalChecked(newValue);
    }

    if (onChange) {
      e.target.checked = !newValue;
      setIsLoading(true);
      try {
        await onChange(newValue);
        if (!isControlled) {
          setInternalChecked(newValue);
        }
      } catch {
        if (!isControlled) {
          setInternalChecked(!newValue);
        }
      } finally {
        setIsLoading(false);
      }
    }
  };

  const sizeClasses = {
    xs: { track: "w-7 h-4", thumb: "w-3 h-3", translate: "translate-x-3" },
    sm: { track: "w-9 h-5", thumb: "w-4 h-4", translate: "translate-x-4" },
    md: { track: "w-11 h-6", thumb: "w-5 h-5", translate: "translate-x-5" },
    lg: { track: "w-14 h-7", thumb: "w-6 h-6", translate: "translate-x-7" },
  }[size];

  const variantColorClass = {
    primary: "bg-primary",
    secondary: "bg-secondary",
    accent: "bg-accent",
    neutral: "bg-slate-300",
    info: "bg-info",
    success: "bg-emerald-500",
    warning: "bg-warning",
    error: "bg-error",
  }[variant];

  return (
    <label
      className={clsx("flex items-center gap-2 cursor-pointer", labelClassName)}
    >
      {labelPosition === "left" && <span className="label-text">{label}</span>}
      <button
        type="button"
        role="switch"
        aria-checked={isChecked}
        disabled={disabled || isLoading}
        onClick={() => {
          const syntheticEvent = {
            target: { checked: !isChecked },
          } as React.ChangeEvent<HTMLInputElement>;
          handleChange(syntheticEvent);
        }}
        className={clsx(
          "relative inline-flex items-center shrink-0 rounded-full transition-all duration-300 ease-out",
          isLoading ? "opacity-50 cursor-not-allowed" : "cursor-pointer",
          isChecked
            ? clsx(variantColorClass, "shadow-lg shadow-emerald-500/30")
            : "bg-slate-300 shadow-inner",
          sizeClasses.track,
          className,
        )}
      >
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <Loader2 size={10} className="animate-spin text-white" />
          </div>
        )}
        <span
          className={clsx(
            "inline-block rounded-full bg-white shadow-lg transform transition-all duration-300 ease-out",
            sizeClasses.thumb,
            isChecked ? sizeClasses.translate : "translate-x-0.5",
          )}
        />
      </button>
      <input
        type="checkbox"
        className="sr-only"
        checked={isChecked}
        readOnly
        {...rest}
      />
      {labelPosition === "right" && <span className="label-text">{label}</span>}
    </label>
  );
};

export default Toggle;
