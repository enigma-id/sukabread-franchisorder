import React from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/services/store";
import { Pagination } from "@/components/ui/pagination";
import clsx from "clsx";

interface PaginationProps {
  name: string;
  onChangePage: (page: number) => void;
  onChangeLimit: (limit: number) => void;
  pageLimit?: number[];
  entityName?: string;
}

const TablePagination: React.FC<PaginationProps> = ({
  name,
  onChangePage,
  onChangeLimit,
  pageLimit = [10, 20, 25, 50, 100],
  entityName = "items",
}) => {
  const stateLimit = useSelector(
    (state: RootState) => state?.table?.data[name]?.limit,
  );
  const stateTotal = useSelector(
    (state: RootState) => state?.table?.data[name]?.total,
  );
  const stateCurrentPage = useSelector(
    (state: RootState) => state?.table?.data[name]?.page,
  );

  const numberOfPages = React.useMemo(() => {
    if (!stateTotal || !stateLimit) return 1;
    const totalPages = Math.ceil(stateTotal / stateLimit);
    return totalPages < 1 ? 1 : totalPages;
  }, [stateTotal, stateLimit]);

  const changedPage = React.useCallback(
    (i: number) => {
      if (stateCurrentPage === i) return;
      onChangePage(i);
    },
    [stateCurrentPage, onChangePage],
  );

  const changedLimit = React.useCallback(
    (i: number) => {
      if (stateLimit === i) return;
      onChangeLimit(i);
    },
    [stateLimit, onChangeLimit],
  );

  const range = React.useMemo(() => {
    if (!stateTotal || !stateLimit || !stateCurrentPage)
      return { start: 0, end: 0, displayed: 0 };
    const start = (stateCurrentPage - 1) * stateLimit + 1;
    const end = Math.min(stateTotal, stateCurrentPage * stateLimit);
    const displayed = end - start + 1;
    return { start, end, displayed };
  }, [stateCurrentPage, stateLimit, stateTotal]);

  if (!stateTotal || numberOfPages <= 1) return null;

  return (
    <div className="border border-gray-200 border-t-0 bg-white min-h-[60px] w-full grid grid-cols-1 xl:grid-cols-3 items-center px-6 py-4 rounded-b-xl gap-4 xl:gap-0">
      <div className="flex items-center gap-4 justify-center xl:justify-start">
        <div className="text-[13px] text-gray-500 font-medium">
          Showing{" "}
          <span className="font-semibold text-[#59A7CE]">
            {range.displayed}
          </span>{" "}
          of <span className="font-semibold">{stateTotal}</span> {entityName}
        </div>
      </div>

      <div className="flex justify-center">
        <Pagination
          currentPage={stateCurrentPage}
          totalPages={numberOfPages}
          onChange={(page: number) => changedPage(page)}
        />
      </div>

      <div className="flex items-center justify-center xl:justify-end gap-2 text-[13px] text-gray-500 font-medium">
        <div className="dropdown dropdown-top dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="flex items-center justify-between gap-3 border border-gray-200 bg-white text-[13px] font-medium text-gray-600 rounded-md py-1.5 px-3 hover:bg-gray-50 transition-colors"
          >
            Show {stateLimit} Row
            <svg
              stroke="currentColor"
              fill="none"
              strokeWidth="2"
              viewBox="0 0 24 24"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-gray-400 w-3.5 h-3.5"
              height="1em"
              width="1em"
              xmlns="http://www.w3.org/2000/svg"
            >
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="dropdown-content z-50 menu p-1.5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] bg-white rounded-lg w-36 border border-gray-100 mb-2"
          >
            {pageLimit.map((limit) => (
              <li key={limit}>
                <a
                  onClick={() => changedLimit(limit)}
                  className={clsx(
                    "text-[13px] py-1.5 px-3 rounded-md mb-0.5 last:mb-0",
                    stateLimit === limit
                      ? "bg-[#59A7CE]/10 text-[#59A7CE] font-semibold"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                  )}
                >
                  Show {limit} Row
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TablePagination;
