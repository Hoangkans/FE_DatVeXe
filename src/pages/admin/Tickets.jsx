import AdminLayout from "../../shared/layouts/AdminLayout";
import ManagerTicket from "../../shared/components/admin/ManagerTicket";

export default function AdminTickets() {
  return (
    <AdminLayout>
      <h1>Quản lý vé xe</h1>
      <ManagerTicket />
    </AdminLayout>
  );
}

