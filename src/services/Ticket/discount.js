import api from "../../config/axios/axiosCongif";

export async function fetchDiscount() {
    try {
        const response = await api.get('/discount-codes/my-available')
        return response.data;

    } catch (err) {
        console.error(
            "Loi khi lay danh sach trip:",
            err?.response?.status,
            err?.response?.data || err?.message
        );
        throw err;
    }
}

