import formatDate from "../../utils//date/date";
import formatPrice from "../../utils/ticket/money";

export default function TicketResult({ result, onClose }) {
    if (!result) return null;

    return (
        <div className="modal-backdrop">
            <div className="modal-content">
                
                <button className="close-btn" onClick={onClose}>&times;</button>

                <h2 style={{ color: '#007bff', marginTop: 0 }}>Thông tin vé của bạn</h2>
                
                <div className="result-details" style={{ textAlign: 'left', margin: '20px 0' }}>
                    <p><strong>Mã vé:</strong> {result.id }</p>
                    <p><strong>Khách hàng:</strong> {result.customerName || "N/A"}</p>
                    <p><strong>Trạng thái:</strong> {result.status}</p>
                    <p><strong>Loại ghế:</strong> {result.seat_type|| "N/A"}</p>
                    <p><strong>Ngày khởi hành:</strong> {formatDate(result.departure_time) || "N/A"}</p>
                    <p><strong>Giá :</strong> {formatPrice(result.price) || "N/A"} đ</p>
                </div>


                <button className="ok-btn" onClick={onClose}>Đóng</button>
            </div>
        </div>
    )
}