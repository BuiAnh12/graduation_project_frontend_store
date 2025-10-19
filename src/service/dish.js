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

export const createDish = async (storeId, data) => {
  try {
    const res = await authApi.post(`/dish/store/${storeId}`, data);
    return res.data;
  } catch (err) {
    throw err.response;
  }
};

export const updateDish = async (storeId, dishId, data) => {
  try {
    const res = await authApi.put(
      `/dish/store/${storeId}/dish/${dishId}`,
      data
    );
    return res.data;
  } catch (err) {
    throw err.response;
  }
};

export const deleteDish = async (storeId, dishId) => {
  try {
    const res = await authApi.delete(`/dish/store/${storeId}/dish/${dishId}`);
    return res.data;
  } catch (err) {
    throw err.response;
  }
};

export const toggleDishStatus = async (storeId, dishId) => {
  try {
    const res = await authApi.post(
      `/dish/store/${storeId}/dish/${dishId}/status`
    );
    return res.data;
  } catch (err) {
    throw err.response;
  }
};

export const getDishById = async (storeId, dishId) => {
  try {
    const res = await authApi.get(`/dish/store/${storeId}/dish/${dishId}`);
    return res.data;
  } catch (err) {
    throw err.response;
  }
};
