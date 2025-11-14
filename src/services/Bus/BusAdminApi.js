import api from "../../config/axios/axiosCongif";

const basePath = "/admin/buses";

export async function fetchBuses(params = {}) {
  try {
    const response = await api.get(`${basePath}/all`, { params });
    return response.data;
  } catch (err) {
    console.error(
      "Lỗi khi lấy danh sách xe:",
      err?.response?.status,
      err?.response?.data || err?.message
    );
    throw err;
  }
}

export async function fetchBusDetail(busId) {
  try {
    const response = await api.get(`${basePath}/${busId}`);
    return response.data;
  } catch (err) {
    console.error(
      "Lỗi khi lấy chi tiết xe:",
      err?.response?.status,
      err?.response?.data || err?.message
    );
    throw err;
  }
}

export async function createBus(payload) {
  try {
    const response = await api.post(basePath, payload);
    return response.data;
  } catch (err) {
    console.error(
      "Lỗi khi tạo xe:",
      err?.response?.status,
      err?.response?.data || err?.message
    );
    throw err;
  }
}

export async function updateBus(busId, payload) {
  try {
    const response = await api.put(`${basePath}/${busId}`, payload);
    return response.data;
  } catch (err) {
    console.error(
      "Lỗi khi cập nhật xe:",
      err?.response?.status,
      err?.response?.data || err?.message
    );
    throw err;
  }
}

export async function deleteBus(busId) {
  try {
    const response = await api.delete(`${basePath}/${busId}`);
    return response.data;
  } catch (err) {
    console.error(
      "Lỗi khi xóa xe:",
      err?.response?.status,
      err?.response?.data || err?.message
    );
    throw err;
  }
}
