import React from "react";
import { useSelector } from "react-redux";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { RootState } from "@/services/store";

interface TableToolsProps {
  name: string;
  onSearch?: (text: string) => void;
  onDownload?: () => void;
  downloadable?: boolean;
  children?: React.ReactNode;
}

const TableTools: React.FC<TableToolsProps> = ({
  name,
  onSearch,
  onDownload,
  downloadable = false,
  children,
}) => {
  const stateSearch = useSelector(
    (state: RootState) => state?.table?.data[name]?.textSearch,
  );

  const [searchTerm, setSearchTerm] = React.useState("");

  React.useEffect(() => {
    if (stateSearch === "") return;
    setSearchTerm(stateSearch);
  }, [stateSearch]);

  React.useEffect(() => {
    if (stateSearch === searchTerm) return;

    const delayDebounceFn = setTimeout(() => {
      onSearch?.(searchTerm);
    }, 600);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  return (
    <div className="flex flex-col xl:flex-row w-full items-start xl:items-center justify-between gap-4 p-4 bg-white border border-gray-200 rounded-t-xl border-b-0 relative">
      <div className="flex items-center gap-2 flex-1 w-full">
        <Input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search..."
          className="!border-0 !shadow-none !bg-transparent focus:!outline-none focus:!ring-0 w-full xl:w-64 text-sm"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm("")}
            className="text-base-content/40 hover:text-base-content"
          >
            &times;
          </button>
        )}
      </div>

      {children && (
        <div className="flex w-full xl:w-auto flex-wrap xl:flex-nowrap gap-3 pb-2 xl:pb-0 z-10">
          {children}
        </div>
      )}

      <div className="flex items-center gap-2 pb-2 xl:pb-0">
        {downloadable && onDownload && (
          <Button
            variant="default"
            styleType="outline"
            size="sm"
            onClick={onDownload}
            className="border-base-300 text-base-content/60 hover:bg-base-200"
          >
            <Download size={14} />
          </Button>
        )}
      </div>
    </div>
  );
};

export default React.memo(TableTools);
