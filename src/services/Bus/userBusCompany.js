import api from "../../config/axios/axiosCongif";

async function fetchUserBusCompanies() {
    try {
        const response = await api.get('/user/bus-companies/all')
        return response.data
    }catch (err){
        console.error("Loi khi lay danh sach nha xe cua nguoi dung:", 
            err?.response?.status,
            err?.response?.data || err?.message
        );
    }
}

export { fetchUserBusCompanies }