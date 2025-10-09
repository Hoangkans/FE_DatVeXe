import axios from "axios";
import BASE_API_URL from "../../services/base.api.url";

const api = axios.create({
  baseURL: BASE_API_URL,
  timeout: 15000,
});

export default api
