import authApi from "./instances/authApi";
import publicApi from "./instances/publicApi";

// Toppings group
export const getAllToppingsGroupByStore = async (storeId) => {
  try {
    const res = await publicApi.get(`/topping-group/store/${storeId}`);
    return res.data;
  } catch (err) {
    throw err.response;
  }
};

export const createToppingGroup = async (data) => {
  try {
    const res = await authApi.post("/topping-group", data);
    return res.data;
  } catch (err) {
    throw err.response;
  }
};

export const updateToppingGroup = async (id, data) => {
  try {
    const res = await authApi.put(`/topping-group/${id}`, data);
    return res.data;
  } catch (err) {
    throw err.response;
  }
};

// Topping
export const getToppings = async (id) => {
  try {
    const res = await publicApi.get(`/topping/group/${id}`);
    return res.data;
  } catch (err) {
    throw err.response;
  }
};

export const addToppingToGroup = async (data) => {
  try {
    const res = await authApi.post(`/topping`, data);
    return res.data;
  } catch (err) {
    throw err.response;
  }
};

export const removeToppingFromGroup = async (id) => {
  try {
    const res = await authApi.delete(`/topping/${id}`);
    return res.data;
  } catch (err) {
    throw err.response;
  }
};

export const removeToppingGroup = async (id) => {
  try {
    const res = await authApi.delete(`/topping-group/${id}`);
    return res.data;
  } catch (err) {
    throw err.response;
  }
};

export const updateTopping = async (id, data) => {
  try {
    const res = await authApi.put(`/topping/${id}`, data);
    return res.data;
  } catch (err) {
    throw err.response;
  }
};
