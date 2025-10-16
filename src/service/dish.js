import authApi from "./instances/authApi";

export const getDishes = async (storeId, query = {}) => {
  try {
    const res = await authApi.get(`/dish/store/${storeId}`, {
      params: query,
    });
    return res.data;
  } catch (err) {
    throw err.response;
  }
};

export const createDish = async (data) => {
  try {
    const res = await authApi.post("/staff", data);
    return res.data;
  } catch (err) {
    throw err.response;
  }
};

export const updateStaff = async (staffId, data) => {
  try {
    const res = await authApi.put(`/staff/${staffId}`, data);
    return res.data;
  } catch (err) {
    throw err.response;
  }
};

export const getStaffDetail = async (staffId) => {
  try {
    const res = await authApi.get(`/staff/detail/${staffId}`);
    return res.data;
  } catch (err) {
    throw err.response;
  }
};

export const deleteStaff = async (storeId, staffId) => {
  try {
    const res = await authApi.delete(`/staff/${storeId}/${staffId}`);
    return res.data;
  } catch (err) {
    throw err.response;
  }
};

export const toggleStatusStaff = async (staffId) => {
  try {
    const res = await authApi.put(`/staff/${staffId}/toggle-status`);
    return res.data;
  } catch (err) {
    throw err.response;
  }
};
