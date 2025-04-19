// src/services/authService.js
import axiosInstance from "./axiosClient"; // Axios instance với interceptors đã thiết lập

const authAdminService = {
    /**
     * Đăng nhập
     * @param {Object} credentials - Thông tin đăng nhập { email, password }
     * @returns {Promise<Object>} - Dữ liệu người dùng và token từ server
     */
    login: async (credentials) => {
        return await axiosInstance.post("/admin/auth/login", credentials);
    },

    /**
     * Đăng xuất
     * @returns {Promise<void>} - Đăng xuất người dùng
     */
    logout: async () => {
        return await axiosInstance.post("/admin/auth/logout");
    },

    /**
     * Refresh token
     * @param {string} refreshToken - Token refresh
     * @param {string} privateKey - Khóa riêng của người dùng
     * @returns {Promise<Object>} - Token mới từ server
     */
    refreshToken: async (refreshToken, privateKey) => {
        return await axiosInstance.post("/auth/handleRefreshToken");
    },
};

export default authAdminService;
