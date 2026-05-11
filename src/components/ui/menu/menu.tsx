import clsx from "clsx";
import type { MenuProps, MenuItem } from "./types";
import { Badge } from "../badge";

export const Menu = ({
  items,
  size = "md",
  horizontal,
  className,
  activeClass,
  inactiveClass,
}: MenuProps) => {
  const sizeClass = {
    xs: "menu-xs",
    sm: "menu-sm",
    md: "",
    lg: "menu-lg",
    xl: "menu-xl",
  }[size];

  return (
    <div
      className={clsx(
        "flex flex-col flex-1 overflow-auto scrollbar-hide px-4 gap-1 pb-4",
        sizeClass,
        horizontal && "menu-horizontal lg:min-w-max flex-row",
        className
      )}
    >
      {items.map((item, i) => (
        <MenuItem
          key={i}
          item={item}
          activeClass={activeClass}
          inactiveClass={inactiveClass}
        />
      ))}
    </div>
  );
};

const MenuItem = ({
  item,
}: {
  item: MenuItem;
  activeClass?: string;
  inactiveClass?: string;
}) => {
  const {
    label,
    icon,
    badge,
    disabled,
    active,
    children,
    onClick,
    hidden,
  } = item;

  if (hidden) return;

  const handleClick = () => {
    if (!disabled) onClick?.(item);
  };

  // Dashboard-like item (standalone, not in a section, no children)
  if (!children || children.length === 0) {
    return (
      <div className="flex flex-col gap-1">
        <div
          className={clsx(
            "flex items-center gap-4 h-12 px-4 rounded-2xl transition-all duration-300 relative cursor-pointer group/item",
            active
              ? "bg-emerald-500/10 text-white shadow-lg shadow-black/10"
              : "text-white/40 hover:text-white/70 hover:bg-white/[0.02]"
          )}
          onClick={handleClick}
        >
          <div
            className={clsx(
              "shrink-0 transition-all duration-300",
              active
                ? "text-emerald-400 drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]"
                : "text-white/20 group-hover/item:text-white/40"
            )}
          >
            {icon}
          </div>
          <span className="text-[14px] font-semibold tracking-wide flex-1">
            {label}
          </span>
          {active && (
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-emerald-500 rounded-l-full shadow-[0_0_15px_rgba(16,185,129,0.5)]"></div>
          )}
          {badge &&
            (typeof item.badge === "string" ? (
              <Badge size="xs">{badge}</Badge>
            ) : (
              badge
            ))}
        </div>
      </div>
    );
  }

  // Section title + collapsible children
  return (
    <>
      {/* Section Title */}
      <div className="pt-6 pb-2 px-4 text-[10px] font-semibold text-white/40 uppercase tracking-widest">
        {label}
      </div>

      {/* Menu Items */}
      {children.map((child, i) => (
        <div key={i} className="flex flex-col gap-1">
          <div
            className={clsx(
              "flex items-center gap-4 h-12 px-4 rounded-2xl transition-all duration-300 relative cursor-pointer group/item",
              child.active
                ? "bg-emerald-500/10 text-white shadow-lg shadow-black/10"
                : "text-white/40 hover:text-white/70 hover:bg-white/[0.02]"
            )}
            onClick={() => {
              if (!child.disabled) child.onClick?.(child);
            }}
          >
            <div
              className={clsx(
                "shrink-0 transition-all duration-300",
                child.active
                  ? "text-emerald-400 drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]"
                  : "text-white/20 group-hover/item:text-white/40"
              )}
            >
              {child.icon}
            </div>
            <span className="text-[14px] font-semibold tracking-wide flex-1">
              {child.label}
            </span>
            {child.active && (
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-emerald-500 rounded-l-full shadow-[0_0_15px_rgba(16,185,129,0.5)]"></div>
            )}
            {child.badge &&
              (typeof child.badge === "string" ? (
                <Badge size="xs">{child.badge}</Badge>
              ) : (
                child.badge
              ))}
          </div>
        </div>
      ))}
    </>
  );
};
