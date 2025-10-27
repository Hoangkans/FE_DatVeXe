export const logout = () => {
    try {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user')
    } catch (err) {
        console.error("Error logout: ", err)
    }
}