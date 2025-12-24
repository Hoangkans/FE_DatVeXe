import MainLayout from "../shared/layouts/MainLayout"
import "../shared/styles/TicketCheck.css"
import contact from "../assets/hotline-bookcar.jpg"
import { checkTicket } from "../services/Ticket/TicketApi"
import { useState } from "react"
import TicketResult from "../shared/components/Ticket/TicketResult"

export default function TicketCheck() {
    const [ticketId, setTicketId] = useState(''); 
    const [phoneNumber, setPhoneNumber] = useState('')
    const [ticketResult, setTicketResult] = useState(null); // Stores the data

    const handleCheckTicket = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget); 
        const ticketCode = formData.get('ticketCode'); 
        const userPhone = formData.get('phoneNumber'); 

        try {
            const result = await checkTicket(ticketCode, userPhone);
            setTicketResult(result.data); 
            console.log(result.data)
        } catch (error) {
            console.error("Error:", error);
            alert("Không tìm thấy vé!");
        }
    }

    return (
        <MainLayout>
            <div className="ticket-check-wrapper">
                <div className="check-overlay">
                    <div className="form-input-wrapper">
                        <div className="form-input">
                            <h2>Nhập thông tin vé xe</h2>
                            <form onSubmit={handleCheckTicket}>
                                <input 
                                    type="text" 
                                    name="ticketCode" 
                                    placeholder="Mã Vé (bắt buộc)" 
                                    required
                                    value={ticketId}
                                    onChange={(e) => setTicketId(e.target.value)}
                                />
                                <input 
                                    type="text" 
                                    name="phoneNumber" 
                                    placeholder="Số điện thoại (bắt buộc)" 
                                    required
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                />
                                <button type="submit">Kiểm tra vé</button>
                            </form>
                        </div>

                        <div className="caution">
                            <h5>Lưu ý:</h5>
                            <p>Trường hợp bạn không thể hủy vé qua mạng... <strong>1900 7070</strong></p>
                        </div>
                    </div>

                    <div className="check-result">
                        <p>Vui lòng nhập vào thông tin và bấm kiểm tra vé</p>
                        <img src={contact} alt="Contact" />
                    </div>

                    {ticketResult && (
                        <TicketResult 
                            result={ticketResult} 
                            onClose={() => setTicketResult(null)}
                        />
                    )}

                </div>
            </div>
        </MainLayout>
    )
}