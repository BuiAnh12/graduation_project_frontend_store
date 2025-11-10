import publicApi from "./instances/publicApi";

export const getAllSystemCategories = async () => {
  try {
    const response = await publicApi.get("/system-categories");
    return response.data;
  } catch (err) {
    throw err.response.data || err.response;
  }
};
