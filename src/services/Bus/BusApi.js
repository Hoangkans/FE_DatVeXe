import api from "../../config/axios/axiosCongif";

async function fetchBusImage() {
    try {
        const response = await api.get('/bus-images')
        return response.data;
    }catch(err) {
        console.error("Loi khi lay du lieu bus: ",err)
        return [];
    }
}

export { fetchBusImage }