import api from "../../config/axios/axiosCongif";

async function fetchBanner() {
    try {
        const response = await api.get('/admin/banners')
        return response.data;
    }catch(err) {
        console.error("Loi khi lay du lieu banner: ",err)
        return [];
    }
}

async function createBanner(bannerData) {
    try {
        const response = await api.post('/admin/banners', bannerData);
        return response.data;
    } catch(err) {
        console.error("Loi tao banner: ", err);
        throw err;
    }
}

async function updateBanner(bannerId, bannerData) {
    try {
        const response = await api.put(`/admin/banners/${bannerId}`, bannerData);
        return response.data;
    } catch(err) {
        console.error("Loi cap nhat du lieu banner: ", err);
        throw err;
    }
}

async function deleteBanner(bannerId) {
    try {
        const response = await api.delete(`/admin/banners/${bannerId}`);
        return response.data;
    } catch(err) {
        console.error("Loi xoa banner: ", err);
        throw err;
    }
}

export { fetchBanner, createBanner, updateBanner, deleteBanner }