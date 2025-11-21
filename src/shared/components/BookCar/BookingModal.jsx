import { useState } from "react";
import "../../styles/BookingModal.css";
import formatMoney from "../../utils/ticket/money";

const getSeatLabel = (type) => {
    switch (type) {
        case "STANDARD":
            return "Ghế Standard";
        case "LUXURY":
            return "Giường nằm cao cấp";
        default:
            return "Tiêu chuẩn";
    }
};

export default function BookingModal({ isOpen, onClose, trip, onConfirm }) {
    const [selectedSeat, setSelectedSeat] = useState(null);

    // Early exit is a good practice
    if (!isOpen || !trip) return null;

    const handleSeatClick = (seat) => {
        // Toggle selection if the same seat is clicked again
        setSelectedSeat((prevSeat) => (prevSeat?.id === seat.id ? null : seat));
    };

    const handleConfirm = () => {
        if (selectedSeat) {
            onConfirm(selectedSeat);
        }
    };
    
    const seatsList = trip.seatsList || [];

    return (
        <div className="booking-modal-overlay" onClick={onClose}>
            <div 
                className="booking-modal-content" 
                onClick={(e) => e.stopPropagation()}
            >
                <div className="booking-modal-header">
                    <h3> Chọn ghế - {trip.name}</h3>
                    <button className="close-btn" onClick={onClose} aria-label="Đóng">&times;</button>
                </div>

                <div className="booking-modal-body">
                    <div className="trip-info-summary">
                        <p><strong>Tuyến:</strong> {trip.fromStation} - {trip.toStation}</p>
                        <p><strong>Giờ:</strong> {trip.depart} • <strong>Giá vé:</strong> {formatMoney(trip.price)}đ</p>
                    </div>

                    <div className="seat-legend">
                        <div className="legend-item"><span className="box available"></span>Trống</div>
                        <div className="legend-item"><span className="box selected"></span>Đang chọn</div>
                        <div className="legend-item"><span className="box booked"></span>Đã đặt</div>
                    </div>

                    <div className="bus-layout">
                        <div className="bus-front">
                            <div className="driver-seat">
                            <span>Driver</span> 
                            </div>
                            <div className="door-area">Cửa lên</div>
                        </div>

                        {/* 2. The Seat Grid */}
                        <div className="seat-grid">
                            {seatsList.length > 0 ? (
                            seatsList.map((seat) => (
                                <button
                                    key={seat.id}
                                    disabled={seat.booked}
                                    className={[
                                        "seat-item",
                                        seat.seat_type.toLowerCase(),
                                        seat.booked ? "booked" : "",
                                        selectedSeat?.id === seat.id ? "selected" : "",
                                    ].join(" ")}
                                    onClick={() => handleSeatClick(seat)}
                                    title={`${seat.seat_number} - ${getSeatLabel(seat.seat_type)}`}
                                >
                                    <div className="seat-shape">
                                        <span className="seat-num">{seat.seat_number}</span>
                                    </div>
                                </button>
                            ))
                            ) : (
                            <div className="no-seats">Không có thông tin ghế ngồi</div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="booking-modal-footer">
                    <div className="selected-info">
                        {selectedSeat ? (
                            <span>Ghế: <strong>{selectedSeat.seat_number}</strong> ({getSeatLabel(selectedSeat.seat_type)})</span>
                        ) : (
                            <span className="info-placeholder">Vui lòng chọn ghế để tiếp tục</span>
                        )}
                    </div>
                    <button 
                        className="btn btn--primary confirm-btn" 
                        disabled={!selectedSeat}
                        onClick={handleConfirm}
                    >
                        Xác nhận đặt vé
                    </button>
                </div>
            </div>
        </div>
    );
}