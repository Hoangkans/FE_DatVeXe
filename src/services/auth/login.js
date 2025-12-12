import api from "../../config/axios/axiosCongif";

export const login = async (email, password) => {
  try {
    const response = await api.post('/auth/login', {
      email: email,
      password: password
    });

    if (response?.data?.token) {
      // Lưu theo key 'token' để axios interceptor gắn Authorization
      localStorage.setItem('token', response.data.token);
      if (response.data.refreshToken) {
        localStorage.setItem('refreshToken', response.data.refreshToken);
      }
      if (response.data.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    }
    throw new Error("Invalid response from backend!");
  } catch (err) {
    console.log("Login failed:", err?.response?.data || err?.message);
    throw err;
  }
}

