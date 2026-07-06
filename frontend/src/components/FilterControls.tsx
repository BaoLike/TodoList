import React from 'react';
import { Search, X, Filter } from 'lucide-react';

interface FilterControlsProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  statusFilter: 'all' | 'active' | 'completed';
  setStatusFilter: (filter: 'all' | 'active' | 'completed') => void;
  priorityFilter: 'all' | 'low' | 'medium' | 'high';
  setPriorityFilter: (filter: 'all' | 'low' | 'medium' | 'high') => void;
}

export const FilterControls: React.FC<FilterControlsProps> = ({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  priorityFilter,
  setPriorityFilter,
}) => {
  return (
    <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
      
      <div className="relative flex-1">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Tìm kiếm công việc theo từ khóa..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-750 dark:bg-slate-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
        />
        {searchQuery && (
          <button 
            onClick={() => setSearchQuery('')}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-650 dark:hover:text-slate-350 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1.5">
          <Filter className="w-4 h-4 text-slate-450 shrink-0" />
          <span className="text-xs font-semibold text-slate-400 hidden sm:inline">Lọc theo:</span>
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as any)}
          className="px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white text-xs font-medium focus:outline-none cursor-pointer"
        >
          <option value="all">Trạng thái: Tất cả</option>
          <option value="active">Chưa hoàn thành</option>
          <option value="completed">Đã hoàn thành</option>
        </select>

        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value as any)}
          className="px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white text-xs font-medium focus:outline-none cursor-pointer"
        >
          <option value="all">Độ ưu tiên: Tất cả</option>
          <option value="high">Ưu tiên Cao</option>
          <option value="medium">Ưu tiên Vừa</option>
          <option value="low">Ưu tiên Thấp</option>
        </select>
      </div>
    </div>
  );
};
