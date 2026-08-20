import React from "react";
import { Search } from "lucide-react";

interface StickyHeaderProps {
  title?: string;
  subtitle?: string;
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isFetching?: boolean;
  showSearch?: boolean;
  children?: React.ReactNode;
}

const StickyHeader: React.FC<StickyHeaderProps> = ({
  subtitle = "Franchise Portal",
  searchPlaceholder = "Search...",
  searchValue,
  onSearchChange,
  isFetching,
  showSearch = true,
  children,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-base-200/80 backdrop-blur-xl px-4 py-4 border-b border-white/20">
      <div className="max-w-lg mx-auto">
        <div
          className={`flex flex-col items-center justify-center ${showSearch || children ? "mb-4" : ""}`}
        >
          <h1 className="text-2xl font-black tracking-tighter text-primary leading-none uppercase">
            <img src="/logo.png" alt="" className="w-24" />
          </h1>
          <div className="flex items-center gap-2 mt-1">
            <div className="h-px w-4 bg-primary/20" />
            <p className="text-[10px] font-black text-base-content/30 tracking-[0.3em] uppercase">
              {subtitle}
            </p>
            <div className="h-px w-4 bg-primary/20" />
          </div>
        </div>

        {children ? (
          children
        ) : showSearch ? (
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-transform group-focus-within:scale-110">
              <Search
                size={16}
                className="text-base-content/30 group-focus-within:text-primary transition-colors"
              />
            </div>
            <input
              type="text"
              placeholder={searchPlaceholder}
              className="w-full h-10 pl-9 pr-9 bg-white rounded-xl text-sm font-bold border-none shadow-sm focus:ring-4 focus:ring-primary/10 transition-all outline-none"
              value={searchValue}
              onChange={onSearchChange}
            />
            {isFetching && (
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                <div className="w-3.5 h-3.5 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
              </div>
            )}
          </div>
        ) : null}
      </div>
    </header>
  );
};

export default StickyHeader;
