import React, { useState } from 'react';
import { User, Lock, AlertCircle, LogIn, UserPlus } from 'lucide-react';
import { todoService } from '../services/todoService';

interface AuthFormProps {
  onSuccess: (username: string) => void;
  addToast: (message: string, type: 'success' | 'info' | 'danger') => void;
}

export const AuthForm: React.FC<AuthFormProps> = ({ onSuccess, addToast }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const validate = () => {
    if (!username.trim()) {
      setError('Tài khoản là bắt buộc');
      return false;
    }
    if (username.trim().length < 3) {
      setError('Tài khoản phải dài tối thiểu 3 ký tự');
      return false;
    }
    if (!password) {
      setError('Mật khẩu là bắt buộc');
      return false;
    }
    if (password.length < 6) {
      setError('Mật khẩu phải dài tối thiểu 6 ký tự');
      return false;
    }
    setError('');
    return true;
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      if (isLogin) {
        const loggedUsername = await todoService.login(username.trim(), password);
        addToast('Đăng nhập thành công!', 'success');
        onSuccess(loggedUsername);
      } else {
        await todoService.register(username.trim(), password);
        addToast('Đăng ký tài khoản thành công! Đang tự động đăng nhập...', 'success');
        const loggedUsername = await todoService.login(username.trim(), password);
        onSuccess(loggedUsername);
      }
    } catch (err: any) {
      setError(err.message || 'Có lỗi xảy ra, vui lòng thử lại.');
      addToast(err.message || 'Thao tác thất bại.', 'danger');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 rounded-3xl shadow-xl transition-all duration-300">
      <div className="text-center mb-6">
        <div className="w-14 h-14 bg-brand-primary/10 text-brand-primary rounded-2xl flex items-center justify-center mx-auto mb-4 animate-bounce-subtle">
          {isLogin ? <LogIn className="w-7 h-7" /> : <UserPlus className="w-7 h-7" />}
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          {isLogin ? 'Chào mừng quay trở lại' : 'Tạo tài khoản mới'}
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          {isLogin ? 'Đăng nhập để quản lý công việc của bạn' : 'Bắt đầu quản lý công việc hiệu quả hơn'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3.5 bg-red-50 text-red-800 border border-red-200 dark:bg-red-950/40 dark:text-red-300 dark:border-red-900 rounded-xl flex items-start gap-2.5 text-xs font-semibold animate-shake">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <div>
          <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
            Tên đăng nhập
          </label>
          <div className="relative">
            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Nhập tên đăng nhập..."
              disabled={loading}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-750 dark:bg-slate-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20 disabled:opacity-50"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
            Mật khẩu
          </label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Nhập mật khẩu..."
              disabled={loading}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-750 dark:bg-slate-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20 disabled:opacity-50"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-brand-primary hover:bg-brand-primary-hover text-white rounded-xl font-semibold text-sm flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all active:scale-[0.98] disabled:opacity-50"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : isLogin ? (
            <>
              <LogIn className="w-4 h-4" />
              Đăng nhập
            </>
          ) : (
            <>
              <UserPlus className="w-4 h-4" />
              Đăng ký
            </>
          )}
        </button>
      </form>

      <div className="text-center pt-4 border-t border-slate-100 dark:border-slate-800 mt-5">
        <button
          type="button"
          disabled={loading}
          onClick={() => {
            setIsLogin(!isLogin);
            setError('');
          }}
          className="text-xs font-semibold text-brand-primary hover:underline cursor-pointer disabled:opacity-50"
        >
          {isLogin ? 'Bạn chưa có tài khoản? Đăng ký ngay' : 'Đã có tài khoản? Đăng nhập ngay'}
        </button>
      </div>
    </div>
  );
};
