import api from "../../config/axios/axiosCongif";

export const register = async (first_name, last_name, email, password, confirm, phone = "") => {
  const body = {
    first_name,
    last_name,
    email,
    password,
    confirm_password: confirm,
    ...(phone ? { phone } : {}),
  };

  console.log("📤 Sending body to backend:", body);
  const res = await api.post("/auth/register", body);
  return res.data;
};
