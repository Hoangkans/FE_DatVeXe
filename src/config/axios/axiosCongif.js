import axios from "axios";
import BASE_API_URL from "../../services/base.api.url";

const api = axios.create({
<<<<<<< HEAD
    baseURL: BASE_API_URL,
    timeout: 5000,
})

export default api
=======
  baseURL: BASE_API_URL,
  timeout: 15000,
});

export default api
>>>>>>> origin/fix-UpdateBaseCode
