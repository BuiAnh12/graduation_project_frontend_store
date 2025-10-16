import authApi from "./instances/authApi";
import publicApi from "./instances/publicApi";
export const getAllCategories = async (storeId) => {
  try {
    const res = await publicApi.get(`/category/store/${storeId}`);
    return res.data;
  } catch (err) {
    throw err.response;
  }
};

export const createCategory = async (data) => {
  try {
    const res = await authApi.post("/category", data);
    return res.data;
  } catch (err) {
    throw err.response;
  }
};

export const updateCategory = async (id, data) => {
  try {
    const res = await authApi.put(`/category/${id}`, data);
    return res.data;
  } catch (err) {
    throw err.response;
  }
};

export const getCategory = async (id) => {
  try {
    const res = await authApi.get(`/category/${id}`);
    return res.data;
  } catch (err) {
    throw err.response;
  }
};

export const deleteCategory = async (id) => {
  try {
    const res = await authApi.delete(`/category/${id}`);
    return res.data;
  } catch (err) {
    throw err.response;
  }
};
