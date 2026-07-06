import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  startIndex: number;
  itemsPerPage: number;
  onPrevPage: () => void;
  onNextPage: () => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  startIndex,
  itemsPerPage,
  onPrevPage,
  onNextPage,
}) => {
  return (
    <div className="flex items-center justify-between bg-white dark:bg-slate-900 px-4 py-3 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm">
      <span className="text-xs text-slate-500 dark:text-slate-400">
        Hiển thị <span className="font-semibold">{startIndex + 1}</span> -{' '}
        <span className="font-semibold">{Math.min(startIndex + itemsPerPage, totalItems)}</span> trên{' '}
        <span className="font-semibold">{totalItems}</span> công việc
      </span>
      <div className="flex items-center gap-1.5">
        <button
          onClick={onPrevPage}
          disabled={currentPage === 1}
          className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:hover:bg-transparent transition-colors cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <span className="text-xs font-semibold px-3 py-1 text-slate-700 dark:text-slate-350">
          Trang {currentPage} / {totalPages}
        </span>
        <button
          onClick={onNextPage}
          disabled={currentPage === totalPages}
          className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:hover:bg-transparent transition-colors cursor-pointer"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
