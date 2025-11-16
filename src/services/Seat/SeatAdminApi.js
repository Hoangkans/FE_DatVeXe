import api from "../../config/axios/axiosCongif";

const basePath = "/admin/seats";

export async function fetchSeatsByBus(busId) {
  if (!busId) return [];
  try {
    const response = await api.get(`${basePath}/${busId}`);
    return response.data;
  } catch (err) {
    console.error(
      "Lỗi khi lấy danh sách ghế:",
      err?.response?.status,
      err?.response?.data || err?.message
    );
    throw err;
  }
}

export async function createSeat(payload) {
  try {
    const response = await api.post(basePath, payload);
    return response.data;
  } catch (err) {
    console.error(
      "Lỗi khi tạo ghế:",
      err?.response?.status,
      err?.response?.data || err?.message
    );
    throw err;
  }
}

export async function updateSeat(id, payload) {
  try {
    const response = await api.put(`${basePath}/${id}`, payload);
    return response.data;
  } catch (err) {
    console.error(
      "Lỗi khi cập nhật ghế:",
      err?.response?.status,
      err?.response?.data || err?.message
    );
    throw err;
  }
}

export async function deleteSeat(id) {
  try {
    const response = await api.delete(`${basePath}/${id}`);
    return response.data;
  } catch (err) {
    console.error(
      "Lỗi khi xóa ghế:",
      err?.response?.status,
      err?.response?.data || err?.message
    );
    throw err;
  }
}
