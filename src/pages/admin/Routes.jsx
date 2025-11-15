import AdminLayout from "../../shared/layouts/AdminLayout";
import ManageRoute from "../../shared/components/admin/ManageRoute";

export default function AdminRoutes() {
  return (
    <AdminLayout>
      <h1>Quản lý tuyến đường</h1>
      <ManageRoute />
    </AdminLayout>
  );
}
