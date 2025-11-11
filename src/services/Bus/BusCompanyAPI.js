import api from "../../config/axios/axiosCongif";

const basePath = "/admin/bus-companies";

async function fetchBusCompanies() {
  try {
    const response = await api.get('/admin/bus-companies/all')
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

async function createBusCompany(busCompanyData) {
  try {
    const response = await api.post(basePath, busCompanyData);
    return response.data;
  } catch (err) {
    console.error("Loi tao nha xe:", err);
    throw err;
  }
}

async function updateBusCompany(busCompanyId, busCompanyData) {
  try {
    const response = await api.put(`${basePath}/${busCompanyId}`, busCompanyData);
    return response.data;
  } catch (err) {
    console.error("Loi cap nhat nha xe:", err);
    throw err;
  }
}

async function deleteBusCompany(busCompanyId) {
  try {
    const response = await api.delete(`${basePath}/${busCompanyId}`);
    return response.data;
  } catch (err) {
    console.error("Loi xoa nha xe:", err);
    throw err;
  }
}

export { fetchBusCompanies, createBusCompany, updateBusCompany, deleteBusCompany };
