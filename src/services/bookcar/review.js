import api from "../../config/axios/axiosCongif";

const basePath = "/user/bus-reviews"

export async function fetchUserReview() {
    try {
        const response = await api.get(`${basePath}/${busId}`)
            return response.data;
    } catch (err) {
        console.error(
            "Loi khi lay danh sach review:",
            err?.response?.status,
            err?.response?.data || err?.message
        );
        throw err;
    }
}

export async function createReview(content) {
    try {
        const response = await api.post(`${basePath}`, content);

        return response.data;
    } catch (err) {
        console.error("Loi tao review: ", err);
        throw err;
    }
}