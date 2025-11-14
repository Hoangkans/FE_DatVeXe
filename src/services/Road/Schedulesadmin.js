import api from "../../config/axios/axiosCongif";

const basePath = "/admin/schedules";
const REQUEST_TIMEOUT = 15000;
const MAX_RETRY = 2;

const requestWithRetry = async (fn, retries = MAX_RETRY) => {
  try {
    const response = await fn();
    return response.data;
  } catch (err) {
    const isTimeout = err?.code === "ECONNABORTED";
    if (isTimeout && retries > 0) {
      return requestWithRetry(fn, retries - 1);
    }
    console.error(
      "Lỗi API lịch trình:",
      err?.response?.status,
      err?.response?.data || err?.message
    );
    throw err;
  }
};

export async function fetchSchedules(params = {}) {
  return requestWithRetry(() =>
    api.get(`${basePath}/all`, {
      params,
      timeout: REQUEST_TIMEOUT,
    })
  );
}

export async function fetchScheduleDetail(scheduleId) {
  return requestWithRetry(() =>
    api.get(`${basePath}/${scheduleId}`, {
      timeout: REQUEST_TIMEOUT,
    })
  );
}

export async function createSchedule(payload) {
  return requestWithRetry(() =>
    api.post(basePath, payload, {
      timeout: REQUEST_TIMEOUT,
    })
  );
}

export async function updateSchedule(scheduleId, payload) {
  return requestWithRetry(() =>
    api.put(`${basePath}/${scheduleId}`, payload, {
      timeout: REQUEST_TIMEOUT,
    })
  );
}

export async function updateScheduleStatus(scheduleId, status) {
  return requestWithRetry(() =>
    api.patch(
      `${basePath}/${scheduleId}/status`,
      { status },
      { timeout: REQUEST_TIMEOUT }
    )
  );
}

export async function updateScheduleSeats(scheduleId, totalSeats) {
  return requestWithRetry(() =>
    api.patch(
      `${basePath}/${scheduleId}/seats`,
      { total_seats: totalSeats },
      { timeout: REQUEST_TIMEOUT }
    )
  );
}

export async function deleteSchedule(scheduleId) {
  return requestWithRetry(() =>
    api.delete(`${basePath}/${scheduleId}`, {
      timeout: REQUEST_TIMEOUT,
    })
  );
}
