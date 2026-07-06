import React from 'react';
import { Trash2 } from 'lucide-react';

interface DeleteConfirmModalProps {
  todoTitle: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  todoTitle,
  onConfirm,
  onCancel,
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-2xl p-6 text-center space-y-4 animate-scale-in border border-slate-200 dark:border-slate-800 shadow-2xl">
        <div className="w-12 h-12 bg-red-50 dark:bg-red-950/30 rounded-full flex items-center justify-center text-brand-danger mx-auto">
          <Trash2 className="w-6 h-6" />
        </div>
        
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Xác nhận xóa?
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
            Bạn có chắc chắn muốn xóa công việc <span className="font-semibold text-slate-700 dark:text-slate-200">"{todoTitle}"</span>? Hành động này không thể hoàn tác.
          </p>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-300 rounded-xl text-sm font-medium transition-colors cursor-pointer"
          >
            Hủy bỏ
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 py-2.5 bg-brand-danger hover:bg-brand-danger-hover text-white rounded-xl text-sm font-medium shadow-md transition-all active:scale-[0.98] cursor-pointer"
          >
            Xóa công việc
          </button>
        </div>
      </div>
    </div>
  );
};
