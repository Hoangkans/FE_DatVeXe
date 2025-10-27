import api from "../../config/axios/axiosCongif";

export const login = async (email, password) => {
    try {
        // Thay link nay bang link backend real
        const response = await api.post('/auth/login', {
            email: email,
            password: password
        }) 

        if (response.data && response.data.token){
            localStorage.setItem('authToken', response.data.token)
            if (response.data.user){
                localStorage.setItem('user', JSON.stringify(response.data.user))
            }
            return response.data;
        } else {
            throw new Error("Invalid response from backend!")
        }
    } catch (err){
        console.log("Login failed: ", err.response?.data || err.message)
        throw err;
    }
}
