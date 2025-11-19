import api from "../../config/axios/axiosCongif";

const basePath = "/user/tickets";

export async function checkTicket(ticketCode){
    try {
        const response = await api.get(`${basePath}/check`, { 
            params: {
                ticket_id: ticketCode,
            }
        });
        return response.data
    }catch (err) {
        console.error(
            "Lỗi khi kiểm tra vé:",
            err?.response?.status,
            err?.response?.data || err?.message
        );
        throw err;
    }
}   