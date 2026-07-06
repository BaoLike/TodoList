# TaskFlow — Todo List App

Ứng dụng quản lý công việc full-stack với **Spring Boot 4** (backend) và **React + TypeScript** (frontend).

---

## Cấu trúc thư mục

```
TodoList/
├── backend/            # Spring Boot API
│   ├── Dockerfile
│   └── src/
├── frontend/           # React + Vite
│   ├── Dockerfile
│   ├── nginx.conf
│   └── src/
├── docker-compose.yml
└── README.md
```

---

## Cách 1 — Chạy bằng Docker (Khuyến nghị)

### Yêu cầu
- [Docker](https://docs.docker.com/get-docker/) & Docker Compose

### Chạy toàn bộ ứng dụng

```bash
cd TodoList
docker compose up --build
```

### Dừng ứng dụng

```bash
docker compose down
```

### Dừng và xóa cả dữ liệu DB

```bash
docker compose down -v
```

---

## Cách 2 — Chạy thủ công (Development)

### Yêu cầu hệ thống

| Công cụ | Phiên bản tối thiểu |
|---------|---------------------|
| Java | 21+ |
| Maven | 3.8+ |
| Node.js | 18+ |
| PostgreSQL | 14+ |

### 1. Chuẩn bị Database

```sql
CREATE DATABASE todolist;
CREATE USER erp_user WITH PASSWORD '123456';
GRANT ALL PRIVILEGES ON DATABASE todolist TO erp_user;
```

### 2. Chạy Backend

```bash
cd backend
mvn spring-boot:run
```

Backend khởi động tại `http://localhost:8080`. Hibernate tự tạo bảng qua `ddl-auto=update`.

### 3. Chạy Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend khởi động tại `http://localhost:5173`.

---

## Sử dụng

1. Mở trình duyệt tại `http://localhost:5173` hoặc vào link deployment `http://todolistqb.duckdns.org/`
2. **Đăng ký** tài khoản mới
3. **Đăng nhập** để vào trang quản lý
4. Thêm, sửa, xóa, lọc và đánh dấu hoàn thành các công việc

---


## Công nghệ sử dụng

**Backend:** Spring Boot 4.1 · Spring Security · Spring Data JPA · PostgreSQL · Lombok

**Frontend:** React 19 · TypeScript · Vite · Tailwind CSS · Nginx (production)

**DevOps:** Docker · Docker Compose
