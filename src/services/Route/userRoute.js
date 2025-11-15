import api from "../../config/axios/axiosCongif";

async function fetchRoute() {
    try {
        const response = await api.get('/user/routes/all')
        return response.data;
    }catch(err) {
        console.error("Loi khi lay du lieu route: ",err)
        return [];
    }
}

export { fetchRoute };