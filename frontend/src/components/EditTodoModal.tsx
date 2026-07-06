import React, { useState, useEffect } from 'react';
import { Edit2, X, AlertCircle } from 'lucide-react';
import type { Todo } from '../services/todoService';

interface EditTodoModalProps {
  todo: Todo;
  onSave: (id: string, title: string, description: string, priority: 'low' | 'medium' | 'high') => void;
  onClose: () => void;
}

export const EditTodoModal: React.FC<EditTodoModalProps> = ({
  todo,
  onSave,
  onClose,
}) => {
  const [editTitle, setEditTitle] = useState(todo.title);
  const [editDesc, setEditDesc] = useState(todo.description);
  const [editPriority, setEditPriority] = useState(todo.priority);
  const [editError, setEditError] = useState('');

  useEffect(() => {
    setEditTitle(todo.title);
    setEditDesc(todo.description);
    setEditPriority(todo.priority);
    setEditError('');
  }, [todo]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!editTitle.trim()) {
      setEditError('Tiêu đề công việc là bắt buộc.');
      return;
    }

    onSave(todo.id, editTitle.trim(), editDesc.trim(), editPriority);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl p-6 space-y-4 animate-scale-in border border-slate-200 dark:border-slate-800 shadow-2xl">
        
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Edit2 className="w-5 h-5 text-brand-primary" />
            Chỉnh Sửa Công Việc
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-750 text-slate-500 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
              Tiêu đề <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={editTitle}
              onChange={(e) => {
                setEditTitle(e.target.value);
                if (e.target.value.trim()) setEditError('');
              }}
              className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20 dark:bg-slate-800 dark:border-slate-700 dark:text-white ${
                editError ? 'border-red-500 ring-2 ring-red-500/10' : 'border-slate-200 dark:border-slate-700'
              }`}
            />
            {editError && (
              <span className="text-xs text-red-500 flex items-center gap-1 mt-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {editError}
              </span>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
              Mô tả
            </label>
            <textarea
              rows={4}
              value={editDesc}
              onChange={(e) => setEditDesc(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20 dark:bg-slate-800 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
              Mức độ ưu tiên
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['low', 'medium', 'high'] as const).map((prio) => (
                <button
                  key={prio}
                  type="button"
                  onClick={() => setEditPriority(prio)}
                  className={`py-2 rounded-lg text-xs font-semibold uppercase tracking-wider border transition-all cursor-pointer ${
                    editPriority === prio
                      ? prio === 'high'
                        ? 'bg-red-50 text-red-700 border-red-300 dark:bg-red-950/40 dark:text-red-300 dark:border-red-800'
                        : prio === 'medium'
                        ? 'bg-amber-50 text-amber-700 border-amber-300 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800'
                        : 'bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800'
                      : 'bg-transparent text-slate-500 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  {prio === 'high' ? 'Cao' : prio === 'medium' ? 'Vừa' : 'Thấp'}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-300 rounded-xl text-sm font-medium transition-colors cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 bg-brand-primary hover:bg-brand-primary-hover text-white rounded-xl text-sm font-medium shadow-md transition-all active:scale-[0.98] cursor-pointer"
            >
              Lưu thay đổi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
