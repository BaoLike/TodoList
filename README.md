# TaskFlow — Todo List App

Ứng dụng quản lý công việc full-stack với **Spring Boot 4** (backend) và **React + TypeScript** (frontend).

---

## Yêu cầu hệ thống

| Công cụ | Phiên bản tối thiểu |
|---------|---------------------|
| Java | 21+ |
| Maven | 3.8+ |
| Node.js | 18+ |
| PostgreSQL | 14+ |

---

## Cấu trúc thư mục

```
TodoList/
├── backend/        # Spring Boot API
└── frontend/       # React + Vite
```

---

## Cài đặt & Chạy

### 1. Chuẩn bị Database (PostgreSQL)

Mở `psql` hoặc pgAdmin và tạo database:

```sql
CREATE DATABASE todolist;
CREATE USER PGUser WITH PASSWORD '123456';
GRANT ALL PRIVILEGES ON DATABASE todolist TO PGUser;
```


---

### 2. Cấu hình Backend

Mở file `backend/src/main/resources/application.properties` và kiểm tra:

```properties
# Kết nối database
spring.datasource.url=jdbc:postgresql://localhost:5432/todolist
spring.datasource.username=PGUser
spring.datasource.password=123456


---

### 3. Chạy Backend

```bash
cd backend
mvn spring-boot:run
```

Backend sẽ khởi động tại `http://localhost:8080`.

Hibernate sẽ **tự động tạo bảng** trong database (nhờ `ddl-auto=update`), không cần chạy SQL thêm.

---

### 4. Chạy Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend sẽ khởi động tại `http://localhost:5173`.

---

## Sử dụng

1. Mở trình duyệt tại `http://localhost:5173` hoặc vô trực tiếp link deployment todolistqb.duckdns.org
2. **Đăng ký** tài khoản mới
3. **Đăng nhập** để vào trang quản lý
4. Thêm, sửa, xóa và đánh dấu hoàn thành các công việc

---

## Công nghệ sử dụng

**Backend**
- Spring Boot 4.1 + Spring Security
- Spring Data JPA + Hibernate 6
- PostgreSQL
- JWT (jjwt 0.12.6)
- Lombok

**Frontend**
- React 18 + TypeScript
- Vite
- Tailwind CSS
- Lucide Icons

---

