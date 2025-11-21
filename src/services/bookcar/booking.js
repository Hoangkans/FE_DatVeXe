import api from "../../config/axios/axiosCongif";

export async function fetchBusCompanies() {
  try {
    const response = await api.get('/user/bus-companies/popular')
        return response.data;
  } catch (err) {
    console.error(
      "Loi khi lay danh sach nha xe:",
      err?.response?.status,
      err?.response?.data || err?.message
    );
    throw err;
  }
}

export async function fetchBusImage(busId){
  try {
    const response = await api.get(`/bus-images/${busId}`)
        return response.data;
  } catch (err) {
    console.error(
      "Loi khi lay anh xe:",
      err?.response?.status,
      err?.response?.data || err?.message
    );
    throw err;
  }
}

export async function fetchBusStation(){
    try {
    const response = await api.get(`/user/stations/all`)
            return response.data;
    } catch (err) {
        console.error(
        "Loi khi lay danh sach nha xe:",
        err?.response?.status,
        err?.response?.data || err?.message
        );
        throw err;
    }
}