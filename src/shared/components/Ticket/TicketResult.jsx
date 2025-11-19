export default function TicketResult({ result, onClose }) {
    if (!result) return null;

    return (
        <div className="modal-backdrop">
            <div className="modal-content">
                
                <button className="close-btn" onClick={onClose}>&times;</button>

                <h2 style={{ color: '#007bff', marginTop: 0 }}>Thông tin vé của bạn</h2>
                
                <div className="result-details" style={{ textAlign: 'left', margin: '20px 0' }}>
                    <div className="result-info-wrapper">
                        <div className="result-info-item">
                             <p><strong>Mã vé:</strong> {result.ticket_info.ticket_code }</p>
                        </div>
                        <div className="result-info-item">
                            <p><strong>Khách hàng:</strong> {result.passenger.name || "N/A"}</p>
                            <p><strong>Số điện thoại:</strong> {result.passenger.phone || "N/A"}</p>
                        </div>
                    </div>

                    <div className="result-info-wrapper">
                        <div className="result-info-item">
                             <p><strong>Số ghế:</strong> {result.seat.seat_number || "N/A"}</p>
                             <p><strong>Loại ghế:</strong> {result.seat.seat_type || "N/A"}</p>
                        </div>
                        <div className="result-info-item">
                            <p><strong>Điểm khởi hành:</strong> {result.schedule.departure_station || "N/A"}</p>
                            <p><strong>Điểm đến:</strong> {result.schedule.arrival_station || "N/A"}</p>
                        </div>
                    </div>
                </div>


                <button className="ok-btn" onClick={onClose}>Đóng</button>
            </div>
        </div>
    )
}