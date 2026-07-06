import React, { useState } from 'react';
import { Plus, AlertCircle, X } from 'lucide-react';

interface AddTodoFormProps {
  onAddTodo: (title: string, description: string, priority: 'low' | 'medium' | 'high') => void;
  onCancel?: () => void;
  showHeader?: boolean;
}

export const AddTodoForm: React.FC<AddTodoFormProps> = ({
  onAddTodo,
  onCancel,
  showHeader = true,
}) => {
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newPriority, setNewPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [addError, setAddError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!newTitle.trim()) {
      setAddError('Tiêu đề công việc là bắt buộc.');
      return;
    }

    onAddTodo(newTitle.trim(), newDesc.trim(), newPriority);
    
    setNewTitle('');
    setNewDesc('');
    setNewPriority('medium');
    setAddError('');
  };

  return (
    <div className="space-y-4">
      {showHeader && (
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800 lg:border-none lg:pb-0">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Plus className="w-5 h-5 text-brand-primary" />
            Thêm Công Việc Mới
          </h2>
          {onCancel && (
            <button
              onClick={onCancel}
              className="lg:hidden p-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-750 text-slate-500 rounded-full transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
            Tiêu đề <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={newTitle}
            onChange={(e) => {
              setNewTitle(e.target.value);
              if (e.target.value.trim()) setAddError('');
            }}
            placeholder="VD: Viết code dự án..."
            className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20 dark:bg-slate-800 dark:border-slate-750 dark:text-white ${
              addError ? 'border-red-500 ring-2 ring-red-500/10' : 'border-slate-200 dark:border-slate-700'
            }`}
          />
          {addError && (
            <span className="text-xs text-red-500 flex items-center gap-1 mt-1">
              <AlertCircle className="w-3.5 h-3.5" />
              {addError}
            </span>
          )}
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
            Mô tả (Không bắt buộc)
          </label>
          <textarea
            rows={4}
            value={newDesc}
            onChange={(e) => setNewDesc(e.target.value)}
            placeholder="Nhập mô tả chi tiết công việc..."
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20 dark:bg-slate-800 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
            Mức độ ưu tiên
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(['low', 'medium', 'high'] as const).map((prio) => (
              <button
                key={prio}
                type="button"
                onClick={() => setNewPriority(prio)}
                className={`py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider border transition-all cursor-pointer ${
                  newPriority === prio
                    ? prio === 'high'
                      ? 'bg-red-50 text-red-700 border-red-300 dark:bg-red-950/40 dark:text-red-300 dark:border-red-800'
                      : prio === 'medium'
                      ? 'bg-amber-50 text-amber-700 border-amber-300 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800'
                      : 'bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800'
                    : 'bg-transparent text-slate-500 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                {prio === 'high' ? 'Cao' : prio === 'medium' ? 'Vừa' : 'Thấp'}
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-brand-primary hover:bg-brand-primary-hover text-white rounded-xl font-medium text-sm flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all active:scale-[0.98]"
        >
          <Plus className="w-5 h-5" />
          Thêm công việc
        </button>
      </form>
    </div>
  );
};
