import api from "../../config/axios/axiosCongif";

export async function fetchPaymentHistory() {
  try {
    const response = await api.get('/user/history/payments')
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
