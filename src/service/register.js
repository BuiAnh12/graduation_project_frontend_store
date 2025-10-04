import axios from "../libs/axiosInstance";

// Step 0
export const checkOwnerInfo = async (formData) => {
  try {
    const res = await axios.post(`/auth/check-register-store-owner`, formData);
    return res.data;
  } catch (error) {
    console.error("Check info error:", error);
    return error.response?.data || { message: "Unknown error occurred" };
  }
};

export const registerStoreOwner = async (formData) => {
  try {
    const res = await axios.post(`/auth/register/store-owner`, formData);
    return res;
  } catch (error) {
    console.error("Register owner error:", error);
    return error.response?.data || { message: "Unknown error occurred" };
  }
};

export const registerStore = async (formData) => {
  try {
    const res = await axios.post(`/auth/register/store`, formData);
    return res.data;
  } catch (error) {
    console.error("Register store error:", error);
    return error.response?.data || { message: "Unknown error occurred" };
  }
};

export const deleteOwner = async (ownerId) => {
  try {
    const res = await axios.delete(`/auth/store-owner/${ownerId}`);
    return res.data;
  } catch (error) {
    console.error("Delete owner error:", error);
    return error.response?.data || { message: "Unknown error occurred" };
  }
};
