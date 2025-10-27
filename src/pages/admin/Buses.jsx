import AdminLayout from "../../shared/layouts/AdminLayout";
import ManagerBusList from "../../shared/components/admin/ManagerBusList";

export default function AdminBuses() {
  return (
    <AdminLayout>
      <h1>Quản lý xe</h1>
      <ManagerBusList />
    </AdminLayout>
  );
}

