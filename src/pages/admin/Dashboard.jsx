import AdminLayout from "../../shared/layouts/AdminLayout";

export default function AdminDashboard() {
  return (
    <AdminLayout>
      <h1>Dashboard</h1>
      <p>Chào mừng đến trang quản trị.</p>
      <div style={{ marginTop: 16, display: "grid", gap: 12 }}>
        <div style={{ padding: 16, background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb" }}>
          <b>Thống kê nhanh</b>
          <p>Ví dụ: người dùng, đơn hàng, doanh thu...</p>
        </div>
      </div>
    </AdminLayout>
  );
}

