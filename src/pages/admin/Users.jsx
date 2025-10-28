import AdminLayout from "../../shared/layouts/AdminLayout";
import ManagerUser from "../../shared/components/admin/ManagerUser";

export default function AdminUsers() {
  return (
    <AdminLayout>
      <h1>Quản lý người dùng</h1>
      <ManagerUser />
    </AdminLayout>
  );
}

