import authApi from "./instances/authApi";

export const getInformation = async (storeId) => {
  try {
    const res = await authApi.get(`/store/${storeId}/info`);
    return res.data;
  } catch (error) {
    throw error.response;
  }
};

export const toggleOpenStatus = async (storeId) => {
  try {
    const res = await authApi.patch(`/store/${storeId}/toggle-status`);
    return res.data;
  } catch (error) {
    throw error.response;
  }
};

export const updateHours = async (storeId, data) => {
  try {
    const res = await authApi.patch(`/store/${storeId}/update-hour`, data);
    return res.data;
  } catch (error) {
    throw error.response;
  }
};

export const updateInfo = async (storeId, data) => {
  try {
    const res = await authApi.patch(`/store/${storeId}/update-info`, data);
    return res.data;
  } catch (error) {
    throw error.response;
  }
};

export const updateImages = async (storeId, data) => {
  try {
    const res = await authApi.patch(`/store/${storeId}/update-image`, data);
    return res.data;
  } catch (error) {
    throw error.response;
  }
};

export const updateAddress = async (storeId, data) => {
  try {
    const res = await authApi.patch(`/store/${storeId}/update-address`, data);
    return res.data;
  } catch (error) {
    throw error.response;
  }
};

export const updatePaperwork = async (storeId, data) => {
  try {
    const res = await authApi.patch(`/store/${storeId}/update-paperwork`, data);
    return res.data;
  } catch (error) {
    throw error.response;
  }
};
