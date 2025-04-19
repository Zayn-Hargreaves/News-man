// src/services/axiosClient.js
import axios from "axios";
import { base_url } from "../config/config";
import { decode_token, getCookie } from "../utils/token.utils";

// Tạo instance của axios
const HEADER = {
    CLIENT_ID: "x-client-id",
    AUTHORIZATION: "authorization",
    PRIVATEKEY: "x-private-key",
    REFRESHTOKEN: "x-rtoken-id",
};

const axiosInstance = axios.create({
    baseURL: base_url,
    headers: {
        "Content-Type": "application/json",
    },
});

// Biến để kiểm soát refresh token
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

// Interceptor cho request
axiosInstance.interceptors.request.use(
    (config) => {
        const accessToken = getCookie("accessToken");

        // Gắn accessToken nếu có
        if (accessToken) {
            config.headers[HEADER.AUTHORIZATION] = `Bearer ${accessToken}`;
            const decodedUser = decode_token(accessToken);
            config.headers[HEADER.CLIENT_ID] = decodedUser.userId;
        }else{
            console.log("access token khong ton tai")
        }

        return config;
    },
    (error) => Promise.reject(error)
);

// Interceptor cho response
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Xử lý khi nhận lỗi 401 và chưa retry
        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then((token) => {
                        originalRequest.headers[HEADER.AUTHORIZATION] = `Bearer ${token}`;
                        const decodedUser = decode_token(accessToken);
                        originalRequest.headers[HEADER.CLIENT_ID] = decodedUser.userId;
                    })
                    .catch((err) => Promise.reject(err));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const refreshToken = getCookie("refreshToken");
                const privateKey = localStorage.getItem("PrivateKey");

                if (!refreshToken || !privateKey) {
                    window.location.href = "/login"; 
                    throw new Error("Missing refreshToken or privateKey");
                }

                // Decode userId từ refreshToken
                const decodedUser = decode_token(refreshToken);
                if(!decodedUser.userId){
                    throw new Error("Missing client id")
                }
                // Gửi yêu cầu refresh token
                const headers1 = {
                    [HEADER.REFRESHTOKEN]: refreshToken,
                    [HEADER.PRIVATEKEY]: privateKey,
                    [HEADER.CLIENT_ID]: decodedUser.userId 
                
                }
                const { data } = await axios.post(
                    `${base_url}/admin/auth/handleRefreshToken`,
                    null,
                    {
                        headers: headers1
                    }
                );
            
                const {accessToken} = data.metadata.metadata;
                document.cookie = `accessToken=${accessToken}; Secure; SameSite=Strict;Path=/admin`;


                // Gắn accessToken mới vào header mặc định
                axiosInstance.defaults.headers.common[HEADER.AUTHORIZATION] = `Bearer ${accessToken}`;

                // Xử lý các yêu cầu đang chờ
                processQueue(null, accessToken);

                // Thực hiện lại request ban đầu
                return axiosInstance(originalRequest);
            } catch (err) {
                processQueue(err, null);
                return Promise.reject(err);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;
