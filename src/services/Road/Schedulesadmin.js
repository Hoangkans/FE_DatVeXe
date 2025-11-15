import api from "../../config/axios/axiosCongif";

const basePath = "/admin/schedules";

export async function fetchSchedules(params = {}) {
  try {
    const response = await api.get(`${basePath}/all`, { params });
    return response.data;
  } catch (err) {
    console.error(
      "Lỗi khi lấy danh sách lịch trình:",
      err?.response?.status,
      err?.response?.data || err?.message
    );
    throw err;
  }
}

export async function fetchScheduleDetail(scheduleId) {
  try {
    const response = await api.get(`${basePath}/${scheduleId}`);
    return response.data;
  } catch (err) {
    console.error(
      "Lỗi khi lấy chi tiết lịch trình:",
      err?.response?.status,
      err?.response?.data || err?.message
    );
    throw err;
  }
}

export async function createSchedule(payload) {
  try {
    const response = await api.post(basePath, payload);
    return response.data;
  } catch (err) {
    console.error(
      "Lỗi khi tạo lịch trình:",
      err?.response?.status,
      err?.response?.data || err?.message
    );
    throw err;
  }
}

export async function updateSchedule(scheduleId, payload) {
  try {
    const response = await api.put(`${basePath}/${scheduleId}`, payload);
    return response.data;
  } catch (err) {
    console.error(
      "Lỗi khi cập nhật lịch trình:",
      err?.response?.status,
      err?.response?.data || err?.message
    );
    throw err;
  }
}

export async function deleteSchedule(scheduleId) {
  try {
    const response = await api.delete(`${basePath}/${scheduleId}`);
    return response.data;
  } catch (err) {
    console.error(
      "Lỗi khi xóa lịch trình:",
      err?.response?.status,
      err?.response?.data || err?.message
    );
    throw err;
  }
}
