import AdminLayout from "../../shared/layouts/AdminLayout";
import Dashboard from "../../shared/components/admin/Dashboard";

export default function AdminDashboard() {
  return (
    <AdminLayout>
      <h1 style={{ margin: 0 }}>Dashboard</h1>
      <div style={{ color: "#64748b", marginBottom: 16, marginTop: 4 }}>
        Tổng quan hoạt động nhà xe
      </div>
      <Dashboard />
    </AdminLayout>
  );
}

