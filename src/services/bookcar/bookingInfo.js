import api from "../../config/axios/axiosCongif";

export async function fetchTripData() {
  try {
    const response = await api.get('/user/schedules/all')
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

