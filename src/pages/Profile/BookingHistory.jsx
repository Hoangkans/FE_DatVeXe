import { useState } from "react";
import formatDate from "../../shared/utils/date/date";
import formatMoney from "../../shared/utils/ticket/money";
import PaginationBar from "../../shared/components/Pagination"; 

import { cancelTicket } from "../../services/Ticket/TicketApi";

export default function BookingHistory({ tickets, loading }) {
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [page, setPage] = useState(1);
    const itemsPerPage = 5; 

    const ticketList = Array.isArray(tickets) 
        ? tickets 
        : (tickets?.data || []);

    const startIndex = (page - 1) * itemsPerPage;
    const currentTickets = ticketList.slice(startIndex, startIndex + itemsPerPage);

    const handleChange = (e, newPage) => {
        setPage(newPage);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancelTicket = async () => {
        if (!selectedTicket) return;
        const isConfirmed = window.confirm(`Bạn có chắc chắn muốn hủy vé #${selectedTicket.ticket_code} không?`);
        
        if (isConfirmed) {
            try {
                await cancelTicket(selectedTicket.id);            
                alert("Hủy vé thành công!");
                setSelectedTicket(null);
                window.location.reload(); 
            } catch (error) {
                alert(error?.response?.data?.message || "Có lỗi xảy ra khi hủy vé.");
            }
        }
    };

    if (loading) return <p>Loading your tickets...</p>;
    if (!tickets || tickets.length === 0) return <div>No ticket history found.</div>;

    return (
        <div className="profile-booking-container">
            <div className="ticket-list" style={{ display: 'grid', gap: '15px' }}>
                {currentTickets.map((ticket) => (
                    <div key={ticket.id} className="profile-card">
                        <div className="profile-card-header">
                            <h3 style={{ margin: 0 }}>
                                {ticket.schedule?.route?.departure_station?.name} 
                                {' '}&rarr;{' '} 
                                {ticket.schedule?.route?.arrival_station?.name}
                            </h3>
                            <span className="profile-status-badge">{ticket.status}</span>
                        </div>
                        
                        <div className="profile-card-body">
                            <p><strong>Khởi hành:</strong> {formatDate(ticket.departure_time)}</p>
                            <p><strong>Giá vé:</strong> {formatMoney(ticket.price)}</p>
                            <p><strong>Mã vé:</strong> {ticket.ticket_code}</p>
                        </div>

                        <button 
                            onClick={() => setSelectedTicket(ticket)}
                            className="profile-button"
                        >
                            Xem chi tiết xe & lịch trình
                        </button>
                    </div>
                ))}
            </div>

            {ticketList.length > itemsPerPage && (
                <PaginationBar 
                    totalItems={ticketList.length}
                    itemsPerPage={itemsPerPage}
                    page={page}
                    onChange={handleChange}
                />
            )}

            {selectedTicket && (
                <div className="profile-modal-overlay" onClick={() => setSelectedTicket(null)}>
                    <div className="profile-modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="profile-modal-header">
                            <h2>Chi tiết vé #{selectedTicket.ticket_code}</h2>
                            <button onClick={() => setSelectedTicket(null)} className="profile-close-btn">&times;</button>
                        </div>

                        <div >
                            <div className="profile-section">
                                <h4>Thông tin xe</h4>
                                <p><strong>Nhà xe:</strong> {selectedTicket.seat?.bus?.name}</p>
                                <p><strong>Biển số:</strong> {selectedTicket.seat?.bus?.license_plate}</p>
                                <p><strong>Loại xe:</strong> {selectedTicket.seat?.bus?.descriptions}</p>
                                <p><strong>Ghế của bạn:</strong> <span style={{color: 'green', fontWeight: 'bold'}}>{selectedTicket.seat?.seat_number}</span> ({selectedTicket.seat_type})</p>
                            </div>
                            
                            <hr />

                            <div className="profile-section">
                                <h4>Lịch trình</h4>
                                <p><strong>Nơi đi:</strong> {selectedTicket.schedule?.route?.departure_station?.name}</p>
                                <p><em>Đ/c: {selectedTicket.schedule?.route?.departure_station?.location}</em></p>
                                <br/>
                                <p><strong>Nơi đến:</strong> {selectedTicket.schedule?.route?.arrival_station?.name}</p>
                                <p><em>Đ/c: {selectedTicket.schedule?.route?.arrival_station?.location}</em></p>
                            </div>

                            <hr />

                            <div className="profile-section">
                                <h4>Thanh toán</h4>
                                <p><strong>Tổng tiền:</strong> {formatMoney(selectedTicket.price)}</p>
                                <p><strong>Ngày đặt:</strong> {formatDate(selectedTicket.created_at)}</p>
                                <p><strong>Trạng thái:</strong> {selectedTicket.status}</p>
                            </div>
                        </div>

                        <div style={{marginTop: '20px', display: 'flex', justifyContent: 'flex-end', gap: '10px'}}>
                             {selectedTicket.status !== 'Đã hủy' && selectedTicket.status !== 'Cancelled' && (
                                <button 
                                    onClick={handleCancelTicket}
                                    style={{
                                        backgroundColor: '#ff4d4f', 
                                        color: 'white',
                                        border: 'none',
                                        padding: '10px 20px',
                                        borderRadius: '5px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Hủy vé
                                </button>
                             )}

                             <button onClick={() => setSelectedTicket(null)} className="profile-button-secondary">Đóng</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}