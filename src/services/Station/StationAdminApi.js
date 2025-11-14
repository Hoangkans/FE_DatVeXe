import api from "../../config/axios/axiosCongif";

const basePath = "/admin/stations";

async function fetchStations() {
  try {
    const response = await api.get(basePath);
    return response.data;
  } catch (err) {
    console.error(
      "Loi khi lay danh sach ben xe:",
      err?.response?.status,
      err?.response?.data || err?.message
    );
    throw err;
  }
}

async function fetchStationDetail(stationId) {
  try {
    const response = await api.get(`${basePath}/${stationId}`);
    return response.data;
  } catch (err) {
    console.error(
      "Loi khi lay chi tiet ben xe:",
      err?.response?.status,
      err?.response?.data || err?.message
    );
    throw err;
  }
}

async function createStation(stationData) {
  try {
    const response = await api.post(basePath, stationData);
    return response.data;
  } catch (err) {
    console.error(
      "Loi tao ben xe:",
      err?.response?.status,
      err?.response?.data || err?.message
    );
    throw err;
  }
}

async function updateStation(stationId, stationData) {
  try {
    const response = await api.patch(`${basePath}/${stationId}`, stationData);
    return response.data;
  } catch (err) {
    console.error(
      "Loi cap nhat ben xe:",
      err?.response?.status,
      err?.response?.data || err?.message
    );
    throw err;
  }
}

async function deleteStation(stationId) {
  try {
    const response = await api.delete(`${basePath}/${stationId}`);
    return response.data;
  } catch (err) {
    console.error(
      "Loi xoa ben xe:",
      err?.response?.status,
      err?.response?.data || err?.message
    );
    throw err;
  }
}

export {
  fetchStations,
  fetchStationDetail,
  createStation,
  updateStation,
  deleteStation,
};
