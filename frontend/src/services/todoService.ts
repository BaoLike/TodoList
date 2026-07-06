export interface Todo {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: string;
  priority: 'low' | 'medium' | 'high';
}

// Map backend enum (LOW/MEDIUM/HIGH) sang frontend type
const mapPriority = (p: string | undefined): 'low' | 'medium' | 'high' => {
  if (p === 'HIGH') return 'high';
  if (p === 'LOW') return 'low';
  return 'medium';
};

const mapPriorityToBackend = (p: 'low' | 'medium' | 'high'): string =>
  p.toUpperCase();

export interface PaginatedTodos {
  todos: Todo[];
  totalItems: number;
  totalPages: number;
}

// Session-based auth: browser tự gửi cookie JSESSIONID, không cần Authorization header
const jsonHeaders = { 'Content-Type': 'application/json' };

const mapTodo = (item: any): Todo => ({
  id: String(item.id),
  title: item.title,
  description: item.description || '',
  completed: item.status === 'COMPLETED',
  createdAt: item.createdAt ? item.createdAt.replace('T', ' ').substring(0, 16) : '',
  priority: mapPriority(item.priority)
});

export const todoService = {
  async register(username: string, password: string): Promise<void> {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: jsonHeaders,
      credentials: 'include',
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Đăng ký thất bại');
    }
  },

  async login(username: string, password: string): Promise<string> {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: jsonHeaders,
      credentials: 'include',
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Đăng nhập thất bại');
    }
    const returnedUsername: string = data.data.username;
    localStorage.setItem('username', returnedUsername);
    return returnedUsername;
  },

  async logout(): Promise<void> {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });
    } catch (e) {
      // ignore
    }
    localStorage.removeItem('username');
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('username');
  },

  getUsername(): string {
    return localStorage.getItem('username') || '';
  },

  async getTodos(
    status: 'all' | 'active' | 'completed' = 'all',
    keyword: string = '',
    page: number = 1,
    size: number = 6,
    priority: 'all' | 'low' | 'medium' | 'high' = 'all'
  ): Promise<PaginatedTodos> {
    const params = new URLSearchParams();
    if (status === 'active') params.append('status', 'PENDING');
    else if (status === 'completed') params.append('status', 'COMPLETED');
    if (priority !== 'all') params.append('priority', priority.toUpperCase());
    if (keyword) params.append('keyword', keyword);
    params.append('page', String(page - 1));
    params.append('size', String(size));

    const res = await fetch(`/api/todos?${params.toString()}`, {
      method: 'GET',
      credentials: 'include'
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Không thể tải danh sách công việc');
    }

    const pageData = data.data;
    return {
      todos: (pageData.content || []).map(mapTodo),
      totalItems: pageData.totalElements || 0,
      totalPages: pageData.totalPages || 1
    };
  },

  async createTodo(title: string, description: string, priority: 'low' | 'medium' | 'high' = 'medium'): Promise<Todo> {
    const res = await fetch('/api/todos', {
      method: 'POST',
      headers: jsonHeaders,
      credentials: 'include',
      body: JSON.stringify({ title, description, priority: mapPriorityToBackend(priority) })
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Không thể tạo công việc');
    }
    return mapTodo(data.data);
  },

  async toggleComplete(id: string, currentCompleted: boolean): Promise<Todo> {
    const nextStatus = currentCompleted ? 'PENDING' : 'COMPLETED';
    const res = await fetch(`/api/todos/${id}/status`, {
      method: 'PATCH',
      headers: jsonHeaders,
      credentials: 'include',
      body: JSON.stringify({ status: nextStatus })
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Không thể cập nhật trạng thái');
    }
    return mapTodo(data.data);
  },

  async updateTodo(id: string, title: string, description: string, priority: 'low' | 'medium' | 'high' = 'medium'): Promise<Todo> {
    const res = await fetch(`/api/todos/${id}`, {
      method: 'PUT',
      headers: jsonHeaders,
      credentials: 'include',
      body: JSON.stringify({ title, description, priority: mapPriorityToBackend(priority) })
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Không thể chỉnh sửa công việc');
    }
    return mapTodo(data.data);
  },

  async deleteTodo(id: string): Promise<void> {
    const res = await fetch(`/api/todos/${id}`, {
      method: 'DELETE',
      credentials: 'include'
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Không thể xóa công việc');
    }
  }
};
