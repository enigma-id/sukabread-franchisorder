import React from "react";

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  className?: string;
}

const SectionTitle: React.FC<SectionTitleProps> = ({ title, subtitle, className = "" }) => {
  return (
    <div className={`mb-6 flex flex-col ${className}`}>
      <div className="flex items-center gap-3">
        <div className="w-1.5 h-6 bg-primary rounded-full shadow-[0_0_12px_oklch(var(--color-primary)/0.4)]" />
        <h2 className="text-sm font-black tracking-[0.2em] text-base-content/80 uppercase">
          {title}
        </h2>
      </div>
      {subtitle && (
        <p className="mt-1 text-[10px] font-bold text-base-content/50 tracking-widest uppercase ml-[1.125rem]">
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default SectionTitle;
