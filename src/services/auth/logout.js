export const logout = () => {
    try {
        localStorage.removeItem('token');
        localStorage.removeItem('user')
    } catch (err) {
        console.error("Error logout: ", err)
    }
}
