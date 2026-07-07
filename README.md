# Giao Diện Portal Quản Trị & Điều Hành AFC (Cấp 3 & Cấp 4)

Dự án này là phân hệ **Frontend Portal** phục vụ quản trị, giám sát và tác nghiệp của Phân hệ **Cấp 3 (Hệ thống tại Ga)** và **Cấp 4 (Hệ thống tại Công ty vận hành)** trong giải pháp kiểm soát vé tự động liên thông AFC.

Trang web được phát triển bằng **Next.js**, **TypeScript** kết hợp cùng hệ thống thư viện **Shadcn/UI** và **Tailwind CSS** để mang lại giao diện quản trị hiện đại, mượt mà và tối ưu trải nghiệm người dùng.

---

## ✨ Các Tính Năng Chính (Core Features)

Portal cung cấp giao diện trực quan cho 3 nhóm đối tượng vận hành (Station Operator, Operator Admin, và Operator Manager):

1.  **📊 Giám sát Thiết bị Ga (Cấp 3):** Dashboard hiển thị trực quan và cập nhật trạng thái hoạt động trực tuyến/ngoại tuyến (Online/Offline) của các cổng soát vé đầu cuối.
2.  **⚙️ Quản lý Hạ tầng & Cấu hình (Master Data):**
    *   Khởi tạo và quản lý danh mục hạ tầng Tuyến (Route), Nhà ga (Station) và Thiết bị đầu cuối (Device).
    *   Thiết lập, đóng gói bộ tham số cấu hình vận hành và Danh sách đen (Blacklist) để kích hoạt lệnh đồng bộ xuống thiết bị ga.
3.  **💸 Giám sát Đối soát Tài chính:** Theo dõi danh sách, số liệu doanh thu và trạng thái quyết toán (Thành công, Thất bại, Đang xử lý) của các lô dữ liệu giao dịch kết chuyển lên Cấp 5.
4.  **📑 Tra cứu Nhật ký Hệ thống (Log Viewer):** Bộ lọc trực quan để truy xuất các tệp tin nhật ký ghi nhận trên MongoDB, bao gồm Nhật ký tích hợp hệ thống (Integration Log), Nhật ký thiết bị (System Log) và Nhật ký thao tác người dùng (Audit Log).

---

## 🛠️ Yêu Cầu Hệ Thống (Prerequisites)

*   **Node.js** (Khuyến nghị phiên bản v18 hoặc v20 LTS).
*   **npm** hoặc **yarn**.
*   Backend Services (dịch vụ `auth-ops` và `afc-ops`) đang được khởi chạy.

---

## 🚀 Hướng Dẫn Cài Đặt & Khởi Chạy (Getting Started)

### Bước 1: Cấu hình biến môi trường (Environment Variables)
Đảm bảo đã có file cấu hình `.env.dev` đặt tại thư mục gốc của frontend với các thông tin kết nối tới API Backend:

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_AUTH_API_BASE_URL=http://localhost:8081/vdt
NEXT_PUBLIC_TICKET_API_BASE_URL=http://localhost:8082/vdt
```

### Bước 2: Cài đặt các gói thư viện phụ thuộc
Chạy lệnh sau để tải về các package cần thiết:

```bash
npm install
```

### Bước 3: Khởi chạy ứng dụng trong môi trường phát triển (Dev Mode)
Dự án sử dụng `dotenv-cli` để nạp các file môi trường thích hợp khi khởi chạy. Thực hiện lệnh:

```bash
npm run dev
```

Sau khi khởi chạy thành công, truy cập giao diện Portal tại địa chỉ: **`http://localhost:3000`**

---

## 📂 Cơ Cấu Thư Mục (Directory Structure)

```text
VDT2026_MetroBus_FE/
│
├── public/               # File tĩnh (ảnh, logo, favicon)
├── src/
│   ├── app/              # Cấu trúc App Router của Next.js (Pages, Routing)
│   ├── components/       # Các UI Component dùng chung (Shadcn/UI và custom)
│   ├── hooks/            # Custom React Hooks
│   ├── lib/              # Tiện ích bổ trợ (axios client, utils)
│   └── types/            # Khai báo kiểu TypeScript (DTO, Entity)
│
├── .env.dev              # Cấu hình biến môi trường kết nối API local
├── package.json          # File quản lý scripts và dependencies
└── tsconfig.json         # Cấu hình compiler cho TypeScript
```
