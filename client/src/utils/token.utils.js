import { jwtDecode } from 'jwt-decode'

const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
};
const deleteCookie = (name) => {
    document.cookie = `${name}=; Max-Age=0; path=/; Secure; SameSite=Strict`;
};

const decode_token = (token) => {

    if (token) {
        try {
            const decoded_token = jwtDecode(token)
            const exp = new Date(decoded_token.exp * 1000)
            if (new Date() > exp) {
                deleteCookie(token)
                return ""
            } else {
                return decoded_token
            }
        } catch (error) {
            return ""
        }
    } else {
        return ""
    }
}

export { decode_token, getCookie, deleteCookie }