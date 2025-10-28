import AdminLayout from "../../shared/layouts/AdminLayout";
import ManagerSchedule from "../../shared/components/admin/ManagerSchedule";

export default function AdminSchedules() {
  return (
    <AdminLayout>
      <h1>Quản lý lịch trình</h1>
      <ManagerSchedule />
    </AdminLayout>
  );
}

