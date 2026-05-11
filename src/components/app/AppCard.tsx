import React from "react";
import { LucideIcon } from "lucide-react";

interface AppCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color?: "blue" | "green" | "red" | "purple" | "orange";
  className?: string;
  onClick?: () => void;
}

const THEMES = {
  blue: { text: "text-blue-500", iconBg: "#dbeafe", wave: "#3b82f6", ripple: "bg-blue-50/50" },
  green: { text: "text-green-500", iconBg: "#dcfce7", wave: "#22c55e", ripple: "bg-green-50/50" },
  red: { text: "text-red-500", iconBg: "#fee2e2", wave: "#ef4444", ripple: "bg-red-50/50" },
  purple: { text: "text-purple-500", iconBg: "#f3e8ff", wave: "#a855f7", ripple: "bg-purple-50/50" },
  orange: { text: "text-orange-500", iconBg: "#ffedd5", wave: "#f97316", ripple: "bg-orange-50/50" },
};

const AppCard: React.FC<AppCardProps> = ({ 
  title, 
  value, 
  icon: Icon, 
  color = "blue", 
  className = "",
  onClick 
}) => {
  const theme = THEMES[color];

  return (
    <div
      onClick={onClick}
      className={`relative overflow-hidden bg-white rounded-3xl shadow-sm border border-base-200 flex items-center justify-between p-5 h-[100px] transition-all active:scale-95 group ${className} ${onClick ? 'cursor-pointer' : ''}`}
    >
      {/* Content */}
      <div className="flex flex-col justify-center z-10 min-w-0 pr-2">
        <span className="text-[10px] font-bold tracking-[0.15em] text-base-content/40 uppercase truncate">
          {title}
        </span>
        <span className="text-2xl font-black text-base-content leading-tight mt-0.5 truncate tracking-tight">
          {value}
        </span>
      </div>

      {/* Icon with Ripple effect */}
      <div className="relative z-10 flex items-center justify-center shrink-0">
        <div className={`absolute w-16 h-16 rounded-full opacity-20 animate-pulse ${theme.ripple}`} />
        <div
          className="flex items-center justify-center rounded-full border border-white shadow-sm"
          style={{
            width: 52,
            height: 52,
            backgroundColor: theme.iconBg,
          }}
        >
          <Icon className={`w-6 h-6 ${theme.text}`} strokeWidth={2.2} />
        </div>
      </div>

      {/* Wave decoration - bottom */}
      <svg
        viewBox="0 0 1440 390"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute bottom-0 left-0 w-full h-[60px] pointer-events-none"
        style={{ opacity: 0.08, transform: "scaleX(-1)" }}
        preserveAspectRatio="none"
      >
        <path
          d="M 0,400 L 0,150 C 36.02,139.67 72.04,129.34 130,138 C 187.96,167.32 267.86,246.64 335,285 C 402.14,323.36 456.52,320.78 522,298 C 587.48,275.22 664.05,232.23 728,232 C 791.95,231.77 843.28,274.29 906,310 C 968.72,345.71 1042.84,374.61 1104,370 C 1165.16,365.39 1213.36,327.27 1276,298 C 1338.64,268.73 1415.72,248.31 1440,238 L 1440,400 Z"
          fill={theme.wave}
        />
      </svg>
    </div>
  );
};

export default AppCard;
