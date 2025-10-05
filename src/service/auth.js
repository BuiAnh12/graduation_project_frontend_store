import publicApi from "./instances/publicApi";

export const login = async (data) => {
  try {
    const response = await publicApi.post("/auth/login/staff", data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
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
  const res = await axios.get("/auth/logout");
  localStorageService.clearAll();
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

export const changePassword = async (passwordData) => {
  try {
    const res = await axios.put("/auth/change-password", passwordData);
    const data = res.data;

    return data;
  } catch (error) {
    console.error("Change password error:", error);
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
