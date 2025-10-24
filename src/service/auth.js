import publicApi from "./instances/publicApi";
import authApi from "./instances/authApi";
export const login = async (data) => {
  try {
    const response = await publicApi.post("/auth/login/staff", data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log("LOGIN DATA: ", response.data);
    return response.data;
  } catch (err) {
    throw err.response;
  }
};

export const getOwneStore = async () => {
  try {
    const res = await axios.post("/auth/store");
    const data = res.data;
    localStorageService.setStore(data.data);
    return data;
  } catch (error) {
    console.error("Get owner store error:", error);
    return error.response?.data || { message: "Unknown error occurred" };
  }
};

export const logoutUser = async () => {
  const res = await publicApi.get("/auth/logout");
};

export const checkStoreOwnerEmail = async (email) => {
  try {
    const res = await axios.get(
      `/auth/check-register-store-owner?email=${email}`
    );
    const data = res.data;

    return data;
  } catch (error) {
    console.error("Email check error:", error);
    return error.response?.data || { message: "Unknown error occurred" };
  }
};

export const refreshAccessToken = async () => {
  try {
    const res = await axios.get("/auth/refresh");
    const data = res.data;

    localStorageService.setToken(data.token);
    return data;
  } catch (error) {
    console.error("Token refresh error:", error);
    return error.response?.data || { message: "Unknown error occurred" };
  }
};

export const resetPassword = async (resetData) => {
  try {
    const res = await axios.post("/auth/reset-password", resetData);
    const data = res.data;

    return data;
  } catch (error) {
    console.error("Reset password error:", error);
    return error.response?.data || { message: "Unknown error occurred" };
  }
};

export const getOwnerStore = async () => {
  try {
    const res = await axios.get("/auth/store");
    const data = res.data;

    return data;
  } catch (error) {
    console.error("Get owner store error:", error);
    return error.response?.data || { message: "Unknown error occurred" };
  }
};

// Forget password
export const changePassword = async (data) => {
  try {
    const res = await authApi.put(`/auth/staff/profile/password`, data);
    return res.data;
  } catch (err) {
    throw err.response;
  }
};

export const forgotPassword = async (data) => {
  try {
    const res = await publicApi.post(`/auth/staff/forgot-password`, data);
    return res.data;
  } catch (err) {
    throw err.response;
  }
};

export const checkOTP = async (data) => {
  try {
    const res = await publicApi.post(`/auth/staff/verify-otp`, data);
    return res.data;
  } catch (err) {
    throw err.response;
  }
};

export const resetPasswordWithEmail = async (data) => {
  try {
    const res = await publicApi.put(`/auth/staff/reset-password`, data);
    return res.data;
  } catch (err) {
    throw err.response;
  }
};
