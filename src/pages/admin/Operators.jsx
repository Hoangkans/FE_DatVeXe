import AdminLayout from "../../shared/layouts/AdminLayout";
import ManageBus from "../../shared/components/admin/ManageBus";


export default function AdminOperators() {
  
  return (
      <AdminLayout>
        <h1>Quản lý nhà xe</h1>
        <ManageBus />
      </AdminLayout>
  );
}
