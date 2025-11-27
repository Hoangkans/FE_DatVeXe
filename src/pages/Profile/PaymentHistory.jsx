import { useState } from "react"; 
import formatDate from "../../shared/utils/date/date"
import formatMoney from "../../shared/utils/ticket/money"
import PaginationBar from "../../shared/components/Pagination";

const getStatusBadge = (status) => {
    const s = status ? status.toUpperCase() : "";
    if (s === "COMPLETED" || s === "SUCCESS") return <span className="badge badge-success">Thành công</span>;
    if (s === "PENDING") return <span className="badge badge-warning">Đang chờ</span>;
    if (s === "FAILED" || s === "CANCELLED") return <span className="badge badge-danger">Thất bại</span>;
    return <span className="badge badge-default">{status}</span>;
};

export default function PaymentHistory({ payments, loading }) {
    const [page, setPage] = useState(1);
    const itemsPerPage = 5;

    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    
    const currentItems = Array.isArray(payments) ? payments.slice(startIndex, endIndex) : [];

    const handleChange = (event, newPage) => { 
        setPage(newPage);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (loading) return <div className="loading-text">Đang tải lịch sử thanh toán...</div>;

    if (!payments || payments.length === 0) {
        return (
            <div className="empty-history">
                <p>Bạn chưa có giao dịch thanh toán nào.</p>
            </div>
        );
    }

    return (
        <div className="payment-history-container">
            <h2 className="tab-title">Lịch sử giao dịch</h2>
            <div className="table-responsive">
                <table className="history-table">
                    <thead>
                        <tr>
                            <th>Mã GD</th>
                            <th>Phương thức</th>
                            <th>Số tiền</th>
                            <th>Ngày thanh toán</th>
                            <th>Trạng thái</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.map((item) => (
                            <tr key={item.id}>
                                <td>#{item.id}</td>
                                <td style={{textTransform: 'capitalize'}}>
                                    {item.payment_method === 'sepay' ? 'SePay QR' : 
                                     item.payment_method === 'momo' ? 'Ví MoMo' : item.payment_method}
                                </td>
                                <td className="amount-col">{formatMoney(item.amount)}</td>
                                <td>{formatDate(item.created_at)}</td>
                                <td>{getStatusBadge(item.status)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {payments.length > itemsPerPage && (
                <PaginationBar 
                    totalItems={payments.length} 
                    itemsPerPage={itemsPerPage}
                    page={page} 
                    onChange={handleChange} 
                />
            )}
        </div>
    );
}