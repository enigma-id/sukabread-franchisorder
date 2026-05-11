import { type ReactNode } from "react";
import clsx from "clsx";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: ReactNode;
  actions?: ReactNode;
  className?: string;
}

export const PageHeader = ({
  title,
  subtitle,
  breadcrumbs,
  actions,
  className,
}: PageHeaderProps) => {
  return (
    <div
      className={clsx(
        "flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6",
        className,
      )}
    >
      <div className="flex flex-col gap-1">
        {breadcrumbs && <div className="mb-2">{breadcrumbs}</div>}
        <h1 className="text-2xl font-bold text-base-content">{title}</h1>
        {subtitle && <p className="text-sm text-base-content/70">{subtitle}</p>}
      </div>

      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
};
