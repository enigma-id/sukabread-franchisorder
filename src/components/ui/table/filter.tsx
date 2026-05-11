import React, { type ReactNode } from "react";
import { SlidersHorizontal, ChevronDown } from "lucide-react";
import { Button } from "../button";
import { Dropdown } from "../dropdown";

interface TableFilterProps {
  children?: ReactNode;
  isActive?: boolean;
  isDirty?: boolean;
  handleClear: () => void;
  handleFilter: () => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const TableFilter: React.FC<TableFilterProps> = ({
  children,
  isActive = false,
  isDirty = false,
  handleClear,
  handleFilter,
  open,
  onOpenChange,
}) => {
  return (
    <Dropdown
      position='end'
      trigger={
        <Button
          styleType='outline'
          className={
            isActive
              ? "border-primary text-primary bg-primary/10 shadow-sm font-medium h-9 px-3 gap-2 w-[200px]"
              : "border-base-300 text-base-content hover:bg-base-200 bg-base-100 shadow-sm font-normal h-9 px-3 gap-2 w-[180px]"
          }
        >
          <SlidersHorizontal className={isActive ? "text-primary w-4 h-4" : "text-base-content/50 w-4 h-4"} />
          <span className='text-sm'>Filter Options</span>
          {isActive && (
            <div className='ml-1 h-2 w-2 rounded-full bg-primary' />
          )}
          <ChevronDown
            className={isActive ? "text-primary ml-1 w-4 h-4" : "text-base-content/40 ml-1 w-4 h-4"}
          />
        </Button>
      }
      contentClassName='w-[90vw] md:w-[500px] p-5 mt-2 bg-base-100 border border-base-300 rounded-xl shadow-lg'
      open={open}
      onOpenChange={onOpenChange}
    >
      <div className='flex flex-col gap-4'>
        <div className='text-sm font-semibold text-base-content border-b border-base-200 pb-3'>
          Filter Options
        </div>
        <div className='flex flex-col gap-3'>{children}</div>

        <div className='flex gap-3 mt-2 pt-4 border-t border-base-200'>
          <Button
            size='sm'
            variant='default'
            onClick={handleClear}
            className='flex-1 border-base-300 text-base-content bg-base-100 hover:bg-base-200 border shadow-sm'
            disabled={!isDirty && !isActive}
          >
            Clear
          </Button>
          <Button
            variant='primary'
            size='sm'
            onClick={handleFilter}
            disabled={!isDirty}
            className='flex-1 shadow-sm font-medium'
          >
            Apply Filter
          </Button>
        </div>
      </div>
    </Dropdown>
  );
};

export default React.memo(TableFilter);
