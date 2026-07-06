import React from 'react';

interface StatsDashboardProps {
  totalCount: number;
  completedCount: number;
  completionPercentage: number;
}

export const StatsDashboard: React.FC<StatsDashboardProps> = ({
  totalCount,
  completedCount,
  completionPercentage,
}) => {
  const pendingCount = totalCount - completedCount;

  return (
    <>
      <div className="hidden sm:flex items-center gap-4 bg-slate-100 dark:bg-slate-900 px-4 py-2 rounded-xl border border-slate-200/50 dark:border-slate-800/50">
        <div className="text-xs text-right">
          <span className="font-semibold block text-slate-700 dark:text-slate-350">
            {completedCount}/{totalCount} hoàn thành
          </span>
          <span className="text-slate-400">Tiến độ: {completionPercentage}%</span>
        </div>
        <div className="w-12 h-12 rounded-full border-4 border-slate-200 dark:border-slate-800 flex items-center justify-center relative overflow-hidden">
          <div 
            className="absolute bottom-0 left-0 right-0 bg-emerald-500/20 transition-all duration-500" 
            style={{ height: `${completionPercentage}%` }}
          />
          <span className="text-xs font-bold text-slate-850 dark:text-white relative z-10">
            {completionPercentage}%
          </span>
        </div>
      </div>

      <section className="sm:hidden grid grid-cols-3 gap-2 w-full text-center">
        <div className="bg-slate-100 dark:bg-slate-900 p-3 rounded-xl border border-slate-200/50 dark:border-slate-800/50">
          <span className="text-xl font-bold block text-indigo-600 dark:text-indigo-400">{totalCount}</span>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">Tất cả</span>
        </div>
        <div className="bg-slate-100 dark:bg-slate-900 p-3 rounded-xl border border-slate-200/50 dark:border-slate-800/50">
          <span className="text-xl font-bold block text-emerald-600 dark:text-emerald-400">{completedCount}</span>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">Đã xong</span>
        </div>
        <div className="bg-slate-100 dark:bg-slate-900 p-3 rounded-xl border border-slate-200/50 dark:border-slate-800/50">
          <span className="text-xl font-bold block text-amber-600 dark:text-amber-400">{pendingCount}</span>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">Đang chờ</span>
        </div>
      </section>
    </>
  );
};
