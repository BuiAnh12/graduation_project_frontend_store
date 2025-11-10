import authApi from "./instances/authApi";

export const getAllOrders = async ({ storeId, status, limit, page }) => {
  try {
    const params = new URLSearchParams();
    if (Array.isArray(status)) {
      params.append("status", status.join(","));
    } else if (status) {
      params.append("status", status);
    }
    if (limit) params.append("limit", limit);
    if (page) params.append("page", page);

    const res = await authApi.get(
      `/order/store/${storeId}?${params.toString()}`
    );
    return res.data;
  } catch (err) {
    throw err.response.data || err.response;
  }
};

export const getOrder = async ({ orderId }) => {
  try {
    const res = await authApi.get(`/order/${orderId}/store`);
    return res.data;
  } catch (err) {
    throw err.response.data || err.response;
  }
};

export const updateOrder = async ({ orderId, updatedData }) => {
  try {
    const res = await authApi.put(`/order/${orderId}`, updatedData);
    return res.data;
  } catch (err) {
    throw err.response.data || err.response;
  }
};

export const finishedOrder = async (orderId) => {
  try {
    const res = await authApi.patch(`/order/${orderId}/finish`);
    return res.data;
  } catch (err) {
    throw err.response.data || err.response;
  }
};

export const cancelOrder = async (orderId) => {
  try {
    const res = await authApi.patch(`/order/${orderId}/cancel-store`);
    return res.data;
  } catch (error) {
    throw error.response.data || error.response;
  }
};

export const resendNotificationToShipper = async (orderId) => {
  try {
    const res = await authApi.patch(`/order/${orderId}/resend-noti`);
    return res.data;
  } catch (error) {
    throw error.response.data || error.response;
  }
};
export const deliveryByStore = async (orderId) => {
  try {
    const res = await authApi.patch(`/order/${orderId}/delivery-by-store`);
    return res.data;
  } catch (error) {
    throw error.response.data || error.response;
  }
};
