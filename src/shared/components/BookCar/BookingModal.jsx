import { useState, useEffect } from "react";
import "../../styles/BookingModal.css";
import formatMoney from "../../utils/ticket/money";
import momo from "../../../assets/brand/momo.png"
import vnpay from "../../../assets/brand/vnpay.png"
import cash from "../../../assets/cash.png"

const getSeatLabel = (type) => {
    switch (type) {
        case "STANDARD": return "Ghế Standard";
        case "LUXURY": return "Giường nằm cao cấp";
        default: return "Tiêu chuẩn";
    }
};

const PAYMENT_METHODS = [
    { id: 'momo', name: 'Ví MoMo', icon: <img src={momo} /> },
    { id: 'vnpay', name: 'VNPay QR', icon: <img src={vnpay} /> },
    { id: 'cash', name: 'Tien Mat', icon: <img src={cash} /> },
];


export default function BookingModal({ isOpen, onClose, trip, onConfirm, isLoading }) {
    const [step, setStep] = useState(1); 
    const [selectedSeat, setSelectedSeat] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState('momo');
    
    const [formData, setFormData] = useState({
        fullName: '',
        phone: '',
        email: ''
    });

    useEffect(() => {
        if (isOpen) {
            setStep(1);
            setSelectedSeat(null);
            setFormData({ fullName: '', phone: '', email: '' });
        }
    }, [isOpen]);

    if (!isOpen || !trip) return null;

    const seatsList = trip.seatsList || [];

    const handleSeatClick = (seat) => {
        if (seat.booked) return;
        setSelectedSeat((prev) => (prev?.id === seat.id ? null : seat));
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleNextStep = () => {
        if (selectedSeat) setStep(2);
    };

    const handleBackStep = () => {
        setStep(1);
    };

    const handleFinalConfirm = () => {
        if (!formData.fullName || !formData.phone) {
            alert("Vui lòng nhập họ tên và số điện thoại");
            return;
        }

        onConfirm({
            seat: selectedSeat,
            passengerInfo: formData,
            paymentMethod: paymentMethod
        });
    };

    const renderSeatSelection = () => (
        <>
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
                    <div className="driver-seat"><span>Tài xế</span></div>
                    <div className="door-area">Cửa lên</div>
                </div>
                <div className="seat-grid">
                    {seatsList.length > 0 ? (
                        seatsList.map((seat) => (
                            <button
                                key={seat.id}
                                disabled={seat.booked}
                                className={`seat-item ${seat.seat_type.toLowerCase()} ${seat.booked ? "booked" : ""} ${selectedSeat?.id === seat.id ? "selected" : ""}`}
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
        </>
    );

    const renderInfoForm = () => (
        <div className="booking-form-container">
            <div className="form-section">
                <h4>Thông tin hành khách</h4>
                <div className="form-group">
                    <label>Họ và tên <span className="req">*</span></label>
                    <input 
                        type="text" 
                        name="fullName" 
                        value={formData.fullName}
                        onChange={handleInputChange}
                        placeholder="Nguyễn Văn A" 
                        autoComplete="name"
                    />
                </div>
                <div className="form-row">
                    <div className="form-group">
                        <label>Số điện thoại <span className="req">*</span></label>
                        <input 
                            type="tel" 
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange} 
                            placeholder="0912..." 
                            autoComplete="tel"
                        />
                    </div>
                    <div className="form-group">
                        <label>Email (Nhận vé điện tử)</label>
                        <input 
                            type="email" 
                            name="email" 
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="email@example.com" 
                            autoComplete="email"
                        />
                    </div>
                </div>
            </div>

            <div className="form-section">
                <h4>Phương thức thanh toán</h4>
                <div className="payment-options">
                    {PAYMENT_METHODS.map(method => (
                        <label key={method.id} className={`payment-card ${paymentMethod === method.id ? 'active' : ''}`}>
                            <input 
                                type="radio" 
                                name="payment" 
                                value={method.id}
                                checked={paymentMethod === method.id}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                            />
                            <span className="pay-icon">{method.icon}</span>
                            <span className="pay-name">{method.name}</span>
                        </label>
                    ))}
                </div>
            </div>
            
            <div className="summary-total">
                <span>Ghế: <strong>{selectedSeat?.seat_number}</strong></span>
                <span>Tổng tiền: <strong className="price-text">{formatMoney(trip.price)}đ</strong></span>
            </div>
        </div>
    );

    return (
        <div className="booking-modal-overlay" onClick={onClose}>
            <div className="booking-modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="booking-modal-header">
                    <h3>{step === 1 ? `Chọn ghế - ${trip.name}` : "Xác nhận & Thanh toán"}</h3>
                    <button className="close-btn" onClick={onClose}>&times;</button>
                </div>

                <div className="booking-modal-body">
                    {step === 1 ? renderSeatSelection() : renderInfoForm()}
                </div>

                <div className="booking-modal-footer">
                    {step === 1 ? (
                        <>
                            <div className="selected-info">
                                {selectedSeat ? (
                                    <span>Ghế: <strong>{selectedSeat.seat_number}</strong> ({getSeatLabel(selectedSeat.seat_type)})</span>
                                ) : (
                                    <span className="info-placeholder">Vui lòng chọn ghế</span>
                                )}
                            </div>
                            <button 
                                className="btn btn--primary confirm-btn" 
                                disabled={!selectedSeat}
                                onClick={handleNextStep}
                            >
                                Tiếp tục
                            </button>
                        </>
                    ) : (
                        <>
                            <button className="btn btn--secondary back-btn" onClick={handleBackStep} disabled={isLoading}>
                                Quay lại
                            </button>
                            <button 
                                className="btn btn--primary confirm-btn" 
                                onClick={handleFinalConfirm}
                                disabled={isLoading}
                                style={{ opacity: isLoading ? 0.7 : 1, cursor: isLoading ? 'wait' : 'pointer' }}
                            >
                                {isLoading ? <><span className="loading-spinner"></span> Đang xử lý...</> : "Thanh toán ngay"}
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}