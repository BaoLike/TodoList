import React from 'react';
import { Calendar, Edit2, Trash2, Check } from 'lucide-react';
import type { Todo } from '../services/todoService';

interface TaskCardProps {
  todo: Todo;
  onToggleComplete: (id: string) => void;
  onStartEdit: (todo: Todo) => void;
  onConfirmDelete: (todo: Todo) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  todo,
  onToggleComplete,
  onStartEdit,
  onConfirmDelete,
}) => {
  const isHigh = todo.priority === 'high';
  const isMedium = todo.priority === 'medium';
  const priorityColor = isHigh 
    ? 'text-red-600 bg-red-50 dark:bg-red-950/30 dark:text-red-400' 
    : isMedium 
    ? 'text-amber-600 bg-amber-50 dark:bg-amber-950/30 dark:text-amber-400' 
    : 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 dark:text-emerald-400';

  return (
    <div
      className={`group relative flex flex-col justify-between p-5 rounded-2xl border transition-all duration-350 shadow-sm ${
        todo.completed
          ? 'bg-slate-50/65 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800/80 opacity-70'
          : 'bg-white dark:bg-slate-900 border-slate-200/90 dark:border-slate-850 hover:shadow-md hover:border-brand-primary/25 dark:hover:border-brand-primary/20'
      }`}
    >
      <div>
        <div className="flex items-start justify-between gap-3 mb-2.5">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <button
              onClick={() => onToggleComplete(todo.id)}
              className="mt-0.5 w-5 h-5 rounded-full border border-slate-350 dark:border-slate-600 flex items-center justify-center cursor-pointer transition-all hover:border-brand-success hover:bg-brand-success/10 shrink-0"
            >
              {todo.completed && (
                <div className="w-3.5 h-3.5 rounded-full bg-brand-success flex items-center justify-center animate-scale-in">
                  <Check className="w-2.5 h-2.5 text-white stroke-[3px]" />
                </div>
              )}
            </button>
            <h3 
              className={`font-semibold text-base text-slate-800 dark:text-slate-100 break-words transition-all select-none ${
                todo.completed ? 'line-through text-slate-400 dark:text-slate-500' : ''
              }`}
            >
              {todo.title}
            </h3>
          </div>

          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider shrink-0 ${priorityColor}`}>
            {todo.priority === 'high' ? 'Cao' : todo.priority === 'medium' ? 'Vừa' : 'Thấp'}
          </span>
        </div>

        <p className={`text-sm text-slate-550 dark:text-slate-405 mb-4 break-words leading-relaxed ${
          todo.completed ? 'text-slate-400 dark:text-slate-500' : ''
        }`}>
          {todo.description || <em className="text-slate-350 dark:text-slate-600 text-xs">Chưa có mô tả chi tiết.</em>}
        </p>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800/80 text-xs text-slate-450 dark:text-slate-500">
        <span className="flex items-center gap-1">
          <Calendar className="w-3.5 h-3.5 text-slate-450 dark:text-slate-550" />
          {todo.createdAt}
        </span>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onStartEdit(todo)}
            className="p-1.5 text-slate-450 hover:text-brand-primary hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            title="Chỉnh sửa công việc"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onConfirmDelete(todo)}
            className="p-1.5 text-slate-450 hover:text-brand-danger hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-colors cursor-pointer"
            title="Xóa công việc"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
