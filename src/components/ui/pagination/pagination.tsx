import clsx from "clsx";
import type { PaginationProps } from "./types";

export const Pagination = ({
  currentPage,
  totalPages,
  onChange,
  className,
}: PaginationProps) => {
  const pages = generatePages(currentPage, totalPages);

  return (
    <div className={clsx("flex items-center gap-2", className)}>
      {/* Previous button */}
      <button
        className={clsx(
          "btn btn-md w-[30px] h-[30px] min-h-[30px] p-0",
          "flex items-center justify-center rounded-md border border-gray-200 bg-white text-gray-500 font-medium hover:bg-gray-50 transition-colors",
          "disabled:bg-gray-100 disabled:text-gray-400 disabled:opacity-75 disabled:cursor-not-allowed",
        )}
        disabled={currentPage === 1}
        onClick={() => onChange(currentPage - 1)}
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='16'
          height='16'
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
        >
          <polyline points='15 18 9 12 15 6'></polyline>
        </svg>
      </button>

      {pages.map((page, i) =>
        page === "..." ? (
          <span
            key={i}
            className={clsx(
              "flex items-center justify-center w-[30px] h-[30px]",
              "text-gray-400 text-sm",
            )}
          >
            ...
          </span>
        ) : (
          <button
            key={i}
            className={clsx(
              "btn btn-md w-[30px] h-[30px] min-h-[30px] p-0 flex items-center justify-center rounded-md border text-[13px] font-medium transition-colors border-gray-200 bg-white text-gray-500 hover:bg-gray-50 hover:text-gray-700",
              page === currentPage && "border-gray-300 bg-white text-gray-800",
            )}
            onClick={() => onChange(page)}
          >
            {page}
          </button>
        ),
      )}

      {/* Next button */}
      <button
        className={clsx(
          "btn btn-md w-[30px] h-[30px] min-h-[30px] p-0",
          "flex items-center justify-center rounded-md border border-gray-200 bg-white text-gray-500 font-medium hover:bg-gray-50 transition-colors",
          "disabled:bg-gray-100 disabled:text-gray-400 disabled:opacity-75 disabled:cursor-not-allowed",
        )}
        disabled={currentPage === totalPages}
        onClick={() => onChange(currentPage + 1)}
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='16'
          height='16'
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
        >
          <polyline points='9 18 15 12 9 6'></polyline>
        </svg>
      </button>
    </div>
  );
};

// Simple page generator with ellipsis logic
const generatePages = (current: number, total: number): (number | "...")[] => {
  const pages: (number | "...")[] = [];
  const maxShown = 5;

  if (total <= maxShown) {
    for (let i = 1; i <= total; i++) pages.push(i);
  } else {
    const start = Math.max(2, current - 1);
    const end = Math.min(total - 1, current + 1);

    pages.push(1);

    if (start > 2) pages.push("...");

    for (let i = start; i <= end; i++) pages.push(i);

    if (end < total - 1) pages.push("...");

    pages.push(total);
  }

  return pages;
};
