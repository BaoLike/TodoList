import { useState, useEffect } from 'react';
import { 
  Plus, 
  Moon, 
  Sun, 
  ClipboardList
} from 'lucide-react';

import { todoService } from './services/todoService';
import type { Todo } from './services/todoService';

import { StatsDashboard } from './components/StatsDashboard';
import { AddTodoForm } from './components/AddTodoForm';
import { FilterControls } from './components/FilterControls';
import { TaskCard } from './components/TaskCard';
import { EditTodoModal } from './components/EditTodoModal';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { Pagination } from './components/Pagination';
import { ToastContainer } from './components/ToastContainer';
import type { Toast } from './components/ToastContainer';
import { AuthForm } from './components/AuthForm';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => todoService.isAuthenticated());
  const [username, setUsername] = useState<string>(() => todoService.getUsername());
  
  const [todos, setTodos] = useState<Todo[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({ total: 0, completed: 0 });

  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('darkMode');
    return saved === 'true';
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [priorityFilter, setPriorityFilter] = useState<'all' | 'low' | 'medium' | 'high'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [todoToDelete, setTodoToDelete] = useState<Todo | null>(null);
  const [isMobileAddOpen, setIsMobileAddOpen] = useState(false);

  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    localStorage.setItem('darkMode', String(isDarkMode));
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, priorityFilter]);

  const addToast = (message: string, type: 'success' | 'info' | 'danger') => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  const loadTodos = async () => {
    if (!isLoggedIn) return;
    setLoading(true);
    try {
      const result = await todoService.getTodos(statusFilter, searchQuery, currentPage, itemsPerPage, priorityFilter);
      setTodos(result.todos);
      setTotalItems(result.totalItems);
      setTotalPages(result.totalPages);
    } catch (err: any) {
      addToast(err.message || 'Không thể tải danh sách công việc', 'danger');
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    if (!isLoggedIn) return;
    try {
      const allRes = await todoService.getTodos('all', '', 1, 1);
      const completedRes = await todoService.getTodos('completed', '', 1, 1);
      setStats({
        total: allRes.totalItems,
        completed: completedRes.totalItems
      });
    } catch (e) {
      // ignore stats fetch errors
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      loadTodos();
      loadStats();
    }
  }, [isLoggedIn, statusFilter, searchQuery, currentPage, priorityFilter]);

  const handleLogout = async () => {
    await todoService.logout();
    setIsLoggedIn(false);
    setUsername('');
    setTodos([]);
    setStats({ total: 0, completed: 0 });
    addToast('Đã đăng xuất thành công.', 'info');
  };

  const handleAddTodo = async (title: string, description: string, priority: 'low' | 'medium' | 'high' = 'medium') => {
    try {
      await todoService.createTodo(title, description, priority);
      addToast('Đã thêm công việc mới thành công!', 'success');
      setIsMobileAddOpen(false);
      loadTodos();
      loadStats();
    } catch (err: any) {
      addToast(err.message || 'Không thể tạo công việc', 'danger');
    }
  };

  const handleToggleComplete = async (id: string) => {
    const todo = todos.find((t) => t.id === id);
    if (!todo) return;
    try {
      await todoService.toggleComplete(id, todo.completed);
      addToast(
        !todo.completed ? 'Đã đánh dấu hoàn thành!' : 'Đã chuyển thành chưa hoàn thành.',
        !todo.completed ? 'success' : 'info'
      );
      loadTodos();
      loadStats();
    } catch (err: any) {
      addToast(err.message || 'Không thể cập nhật trạng thái', 'danger');
    }
  };

  const handleSaveEdit = async (id: string, title: string, description: string, priority: 'low' | 'medium' | 'high' = 'medium') => {
    try {
      await todoService.updateTodo(id, title, description, priority);
      addToast('Đã cập nhật công việc thành công.', 'success');
      setEditingTodo(null);
      loadTodos();
    } catch (err: any) {
      addToast(err.message || 'Không thể cập nhật công việc', 'danger');
    }
  };

  const handleDelete = async () => {
    if (!todoToDelete) return;
    try {
      await todoService.deleteTodo(todoToDelete.id);
      addToast(`Đã xóa công việc "${todoToDelete.title}"`, 'danger');
      setTodoToDelete(null);
      loadTodos();
      loadStats();
    } catch (err: any) {
      addToast(err.message || 'Không thể xóa công việc', 'danger');
    }
  };

  const completionPercentage = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  if (!isLoggedIn) {
    return (
      <div className={`min-h-screen flex items-center justify-center transition-colors duration-300 p-4 ${isDarkMode ? 'bg-slate-955 text-slate-100' : 'bg-slate-50 text-slate-800'}`}>
        <ToastContainer toasts={toasts} />
        <AuthForm onSuccess={(user) => {
          setUsername(user);
          setIsLoggedIn(true);
        }} addToast={addToast} />
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-slate-955 text-slate-100' : 'bg-slate-50 text-slate-800'}`}>
      
      <ToastContainer toasts={toasts} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        <header className="flex flex-col md:flex-row md:items-center md:justify-between pb-6 mb-8 border-b border-slate-200 dark:border-slate-800 gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-brand-primary/10 text-brand-primary rounded-2xl">
              <ClipboardList className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                TaskFlow
              </h1>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 justify-end md:justify-start">
            <div className="text-sm text-slate-655 dark:text-slate-350 mr-1">
              Chào, <span className="font-bold text-brand-primary">{username}</span>
            </div>

            <button
              onClick={handleLogout}
              className="px-3.5 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 border border-red-200 dark:border-red-950/50 rounded-xl transition-colors cursor-pointer"
            >
              Đăng xuất
            </button>

            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Toggle Theme"
            >
              {isDarkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-650" />}
            </button>

            <StatsDashboard 
              totalCount={stats.total}
              completedCount={stats.completed}
              completionPercentage={completionPercentage}
            />
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          <aside className="hidden lg:block lg:col-span-1">
            <div className="sticky top-6 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm">
              <AddTodoForm 
                onAddTodo={handleAddTodo}
                showHeader={true}
              />
            </div>
          </aside>

          <main className="col-span-1 lg:col-span-3 space-y-6">
            
            <FilterControls 
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              priorityFilter={priorityFilter}
              setPriorityFilter={setPriorityFilter}
            />

            {loading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="w-10 h-10 border-4 border-brand-primary/20 border-t-brand-primary rounded-full animate-spin" />
                <span className="text-sm font-semibold text-slate-500 mt-4">Đang tải dữ liệu...</span>
              </div>
            ) : todos.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {todos.map((todo) => (
                  <TaskCard 
                    key={todo.id}
                    todo={todo}
                    onToggleComplete={handleToggleComplete}
                    onStartEdit={setEditingTodo}
                    onConfirmDelete={setTodoToDelete}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-12 text-center shadow-sm flex flex-col items-center max-w-lg mx-auto">
                <div className="w-16 h-16 bg-slate-105 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-400 mb-4">
                  <ClipboardList className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">
                  Không tìm thấy công việc nào
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mb-6">
                  {stats.total === 0 
                    ? 'Bạn chưa tạo công việc nào. Hãy tạo một công việc mới để bắt đầu quản lý tiến độ hiệu quả!'
                    : 'Không tìm thấy công việc khớp với bộ lọc hoặc từ khóa tìm kiếm của bạn. Hãy thử thay đổi từ khóa hoặc bộ lọc.'}
                </p>
                {stats.total > 0 && (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setStatusFilter('all');
                      setPriorityFilter('all');
                    }}
                    className="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 font-semibold text-xs rounded-xl dark:bg-indigo-950/30 dark:text-indigo-400 transition-colors cursor-pointer"
                  >
                    Xóa bộ lọc tìm kiếm
                  </button>
                )}
              </div>
            )}

            {!loading && totalPages > 1 && (
              <Pagination 
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={totalItems}
                startIndex={(currentPage - 1) * itemsPerPage}
                itemsPerPage={itemsPerPage}
                onPrevPage={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
                onNextPage={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
              />
            )}

          </main>

        </div>
      </div>

      <button
        onClick={() => setIsMobileAddOpen(true)}
        className="lg:hidden fixed bottom-6 right-6 w-14 h-14 bg-brand-primary hover:bg-brand-primary-hover text-white rounded-full flex items-center justify-center shadow-xl z-30 transition-transform active:scale-95 cursor-pointer"
        aria-label="Thêm công việc mới"
      >
        <Plus className="w-6 h-6 stroke-[2.5px]" />
      </button>

      {isMobileAddOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-xs flex items-end justify-center animate-fade-in">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-t-3xl p-6 space-y-4 animate-slide-up border-t border-slate-200 dark:border-slate-800 shadow-2xl">
            <AddTodoForm 
              onAddTodo={handleAddTodo}
              onCancel={() => setIsMobileAddOpen(false)}
              showHeader={true}
            />
          </div>
        </div>
      )}

      {editingTodo && (
        <EditTodoModal 
          todo={editingTodo}
          onSave={handleSaveEdit}
          onClose={() => setEditingTodo(null)}
        />
      )}

      {todoToDelete && (
        <DeleteConfirmModal 
          todoTitle={todoToDelete.title}
          onConfirm={handleDelete}
          onCancel={() => setTodoToDelete(null)}
        />
      )}

    </div>
  );
}
