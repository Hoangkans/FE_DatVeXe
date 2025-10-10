import AdminLayout from "../../shared/layouts/AdminLayout";
import ManageStation from "../../shared/components/admin/ManageStation";

export default function AdminStations() {
  

  return (
      <AdminLayout>
        <h1>Quản lý bến xe</h1>
        <ManageStation />
      </AdminLayout>
  );
}
