import publicApi from "./instances/publicApi";
import authApi from "./instances/authApi";

export const getVouchersByStore = async (storeId, query = {}) => {
  try {
    const res = await authApi.get(`/voucher/store/${storeId}`, {
      params: query,
    });
    return res.data;
  } catch (err) {
    throw err.response;
  }
};

export const getDetailVoucher = async (voucherId) => {
  try {
    const res = await publicApi.get(`/voucher/detail/${voucherId}`);
    return res.data;
  } catch (err) {
    throw err.response;
  }
};

export const createVoucher = async (storeId, data) => {
  try {
    const res = await authApi.post(`/voucher/${storeId}`, data);
    return res.data;
  } catch (err) {
    throw err.response;
  }
};

export const updateVoucher = async (storeId, data) => {
  try {
    const res = await authApi.put(`/voucher/${storeId}`, data);
    return res.data;
  } catch (err) {
    throw err.response;
  }
};

export const deleteVoucher = async (voucherId) => {
  try {
    const res = await authApi.delete(`/voucher/${voucherId}`);
    return res.data;
  } catch (err) {
    throw err.response;
  }
};

export const toggleVoucherActiveStatus = async (storeId, voucherId) => {
  try {
    const res = await authApi.put(`/voucher/toggle/${storeId}/${voucherId}`);
    return res.data;
  } catch (err) {
    throw err.response;
  }
};
