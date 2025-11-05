import api from "../../config/axios/axiosCongif";

async function fetchBusStation() {
    try {
        const response = await api.get('/user/stations/all')
        return response.data;
    }catch(err) {
        console.error("Loi khi lay du lieu stations: ",err)
        return [];
    }
}

export { fetchBusStation }