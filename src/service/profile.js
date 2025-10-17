import authApi from "./instances/authApi";

export const getProfile = async () => {
  try {
    const res = await authApi.get(`/auth/staff/profile`);
    return res.data;
  } catch (err) {
    throw err.response;
  }
};

export const updateProfileInfo = async (data) => {
  try {
    const res = await authApi.put(`/auth/staff/profile/info`, data);
    return res.data;
  } catch (err) {
    throw err.response;
  }
};

export const checkCurrentPassword = async (data) => {
  try {
    const res = await authApi.post(
      `/auth/staff/profile/check-current-password`,
      data
    );
    return res.data;
  } catch (err) {
    throw err.response;
  }
};
