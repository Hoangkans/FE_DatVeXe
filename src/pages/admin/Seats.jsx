import AdminLayout from "../../shared/layouts/AdminLayout";
import ManageSeat from "../../shared/components/admin/ManageSeat";

export default function AdminSeats() {
  return (
    <AdminLayout>
      <h1>Quản lý ghế</h1>
      <ManageSeat />
    </AdminLayout>
  );
}
