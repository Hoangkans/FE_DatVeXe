import api from "../../config/axios/axiosCongif";



export async function createMoMoPayment(paymentData, token) {
    try {
        const response = await api.post('payments/momo/create',paymentData);
        return response.data;
    } catch (err) {
        console.error(
        "Loi tao thanh toan:",
        err?.response?.status,
        err?.response?.data || err?.message
        );
        throw err;
    }
}


export async function createSePayPayment(paymentData, token) {
    try {
        const response = await api.post('payment/sepay/create', paymentData);
        return response.data;
    } catch (err) {
        console.error(
        "Loi tao thanh toan:",
        err?.response?.status,
        err?.response?.data || err?.message
        );
        throw err;
    }
}
