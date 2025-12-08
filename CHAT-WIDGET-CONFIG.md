# 🚫 Chat Widget - Ẩn Trên Trang Đăng Nhập/Đăng Ký

## ✅ Đã Cấu Hình

Chat widget sẽ **KHÔNG hiển thị** trên các trang sau:

- `/login` - Trang đăng nhập
- `/register` - Trang đăng ký
- `/forgot-password` - Trang quên mật khẩu
- `/auth/login` - Đăng nhập (backup path)
- `/auth/register` - Đăng ký (backup path)

## 🔧 Cách Hoạt Động

```jsx
// Trong ChatWidget.jsx
const shouldShowChat = () => {
  const hiddenPaths = [
    "/login",
    "/register",
    "/forgot-password",
    "/auth/login",
    "/auth/register",
  ];
  return !hiddenPaths.includes(location.pathname);
};

// Không render nếu đang ở trang bị ẩn
if (!shouldShowChat()) {
  return null;
}
```

## 📝 Thêm Trang Mới Cần Ẩn

Để ẩn chat widget trên trang mới, thêm đường dẫn vào mảng `hiddenPaths`:

```jsx
const hiddenPaths = [
  "/login",
  "/register",
  "/forgot-password",
  "/new-page-to-hide", // ← Thêm trang mới ở đây
  "/auth/login",
  "/auth/register",
];
```

## 🎯 Lý Do

- **UX tốt hơn**: Không làm phiền user khi đang đăng nhập/đăng ký
- **Tập trung**: User có thể focus vào form mà không bị distract
- **Professional**: Giao diện sạch sẽ trên các trang quan trọng

Chat widget vẫn hiển thị bình thường trên tất cả các trang khác! ✨
