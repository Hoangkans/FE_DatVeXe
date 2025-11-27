import api from "../../config/axios/axiosCongif";

const basePath = "/payment/create"

export async function createPayment(paymentData) {
  try {
    const response = await api.post(basePath, paymentData);
    return response.data;
  } catch (err) {
    console.error(
      "Loi luu thong tin thanh toan:",
      err?.response?.status,
      err?.response?.data || err?.message
    );
    throw err;
  }
}