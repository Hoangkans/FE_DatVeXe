import api from "../../config/axios/axiosCongif";

const ADMIN_BASE = "/admin/routes";
const USER_BASE = "/user/routes";

export async function fetchRoute(params = {}) {
  try {
    const response = await api.get(`${USER_BASE}/all`, { params });
    return response.data;
  } catch (err) {
    console.error(
      "Lỗi khi lấy danh sách tuyến đường (user):",
      err?.response?.status,
      err?.response?.data || err?.message
    );
    return [];
  }
}

export async function fetchRoutes(params = {}) {
  try {
    const response = await api.get(`${ADMIN_BASE}/all`, { params });
    return response.data;
  } catch (err) {
    console.error(
      "Lỗi khi lấy danh sách tuyến đường (admin):",
      err?.response?.status,
      err?.response?.data || err?.message
    );
    throw err;
  }
}

export async function fetchRouteDetail(routeId) {
  try {
    const response = await api.get(`${ADMIN_BASE}/${routeId}`);
    return response.data;
  } catch (err) {
    console.error(
      "Lỗi khi lấy chi tiết tuyến đường:",
      err?.response?.status,
      err?.response?.data || err?.message
    );
    throw err;
  }
}

export async function createRoute(payload) {
  try {
    const response = await api.post(ADMIN_BASE, payload);
    return response.data;
  } catch (err) {
    console.error(
      "Lỗi khi tạo tuyến đường:",
      err?.response?.status,
      err?.response?.data || err?.message
    );
    throw err;
  }
}

export async function updateRoute(routeId, payload) {
  try {
    const response = await api.put(`${ADMIN_BASE}/${routeId}`, payload);
    return response.data;
  } catch (err) {
    console.error(
      "Lỗi khi cập nhật tuyến đường:",
      err?.response?.status,
      err?.response?.data || err?.message
    );
    throw err;
  }
}

export async function deleteRoute(routeId) {
  try {
    const response = await api.delete(`${ADMIN_BASE}/${routeId}`);
    return response.data;
  } catch (err) {
    console.error(
      "Lỗi khi xóa tuyến đường:",
      err?.response?.status,
      err?.response?.data || err?.message
    );
    throw err;
  }
}
