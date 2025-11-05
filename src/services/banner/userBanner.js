import api from "../../config/axios/axiosCongif";

async function fetchBanner() {
    try {
        const response = await api.get('/banners/all')
        return response.data;
    }catch(err) {
        console.error("Loi khi lay du lieu banner: ",err)
        return [];
    }
}

export {fetchBanner}