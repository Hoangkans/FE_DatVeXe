import AdminLayout from "../../shared/layouts/AdminLayout";
import ManagerBanner from "../../shared/components/admin/ManagerBanner";

export default function AdminBanners() {
  return (
    <AdminLayout>
      <h1>Quản lý Banner</h1>
      <ManagerBanner />
    </AdminLayout>
  );
}

