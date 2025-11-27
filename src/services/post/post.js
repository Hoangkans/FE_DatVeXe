import api from "../../config/axios/axiosCongif";

const basePath = "/user/articles"

export async function fetchAllArticle() {
  try {
    const response = await api.get(`${basePath}/all`)
    return response.data;

  } catch (err) {
    console.error(
      "Loi khi lay danh sach bai viet:",
      err?.response?.status,
      err?.response?.data || err?.message
    );
    throw err;
  }
}

