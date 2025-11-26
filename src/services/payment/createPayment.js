import api from "../../config/axios/axiosCongif";

const basePath = "/payments/momo/create"

async function createMoMoPayment(paymentData, token) {
    try {
        const response = await api.post(basePath, paymentData);
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

export default createMoMoPayment