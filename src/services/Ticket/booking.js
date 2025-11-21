import api from "../../config/axios/axiosCongif";

export async function bookTicket(userId, scheduleId, seatId, seatType, price, ticketCode) {
    try {
        const response = await api.post('/user/tickets/book', 
            {
                schedule_id: scheduleId,
                seat_id: seatId,
                seat_type: seatType,
                price: price,
                ticket_code:  ticketCode,
                user_id: userId
            }
        );
        return response.data;
    } catch(err) {
        console.error("Loi dat ve: ", err);
        throw err;
    }
}