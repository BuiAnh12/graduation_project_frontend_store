import authApi from "./instances/authApi";

export const getAllNotifications = async () => {
  try {
    const res = await authApi.get("/notification/get-all-notifications");
    return res.data;
  } catch (err) {
    throw err.response.data || err.response;
  }
};

export const updateNotificationStatus = async (notificationId) => {
  try {
    const res = await authApi.put(
      `/notification/update-notification/${notificationId}`
    );
    return res.data;
  } catch (err) {
    throw err.response.data || err.response;
  }
};
