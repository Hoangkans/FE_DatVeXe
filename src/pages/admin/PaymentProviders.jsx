import AdminLayout from "../../shared/layouts/AdminLayout";
import ManagerPaymentProvider from "../../shared/components/admin/ManagerPaymentProvider";

export default function AdminPaymentProviders() {
  return (
    <AdminLayout>
      <h1>Quản lý nhà cung cấp thanh toán</h1>
      <ManagerPaymentProvider />
    </AdminLayout>
  );
}

