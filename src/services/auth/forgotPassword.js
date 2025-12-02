import api from "../../config/axios/axiosCongif";

export async function emailSubmit(email) {
    try {
        const response = await api.post('/auth/forgot-password', {email});
        return response.data;
    } catch(err) {
        console.error("Loi xac nhan email: ", err);
        throw err;
    }
}

export async function otpVerify(email, otp){
    try {
        const response = await api.post('/auth/verify-otp', {email, otp})
        return response.data
    } catch (err){
        console.error(err?.response?.data || err?.message);
        throw  err;
    }
}

export async function resetPassword(token, newPass){
    try {
        const response = await api.post('/auth/reset-password', { 
            resetToken: token, 
            newPassword: newPass 
        });
        return response.data
    } catch (err) {
        console.error(err?.response?.data || err?.message);
        throw  err;
    }
}

export async function UpdatePassword(oldPass, newPass) {
    try {   
        const response = await api.put('/user/change-password', {
            old_password: oldPass,
            new_password: newPass
        });
        return response.data
    }catch (err) {
        console.log(err?.response?.data || err?.message)
        throw err;
    }
}