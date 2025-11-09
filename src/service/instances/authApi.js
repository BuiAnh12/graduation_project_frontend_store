import axios from "axios";
import publicApi from "./publicApi";
const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URI;

const authApi = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

authApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// refresh token

authApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const newAccessToken = await axios.get(
          "http://localhost:5000/api/v1/auth/refresh/staff",
          { withCredentials: true }
        );
        // localStorage.setItem("token", newAccessToken.accessToken);
        originalRequest.headers[
          "Authorization"
        ] = `Bearer ${newAccessToken.data.data.token}`;
        return axios(originalRequest);
      } catch (err) {
        localStorage.removeItem("token");
        window.location.href = "/auth/login";
        return Promise.reject(err);
      }
    }
    return Promise.reject(error);
  }
);
export default authApi;
