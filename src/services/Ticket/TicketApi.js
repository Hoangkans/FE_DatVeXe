import api from "../../config/axios/axiosCongif";

const basePath = "/user/tickets";

export async function checkTicket(ticketCode, userPhone){
    try {
        const response = await api.get(`${basePath}/check`, { 
            params: {
                ticket_code: ticketCode,
                phone_number: userPhone,
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

export async function ticketHistory(userId){
    try{
        const response = await api.get(`${basePath}/my-tickets`)
        return response.data;
    }catch(err) {
        console.error(
            "Lỗi khi kiểm tra vé:",
            err?.response?.status,
            err?.response?.data || err?.message
        );
        throw err;
    }
}