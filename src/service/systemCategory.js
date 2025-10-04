import publicApi from "./instances/publicApi";

export const getAllSystemCategories = async () => {
  try {
    const response = await publicApi.get("/system-categories");
    console.log(response);
    return response.data;
  } catch (err) {
    console.log(err);
    throw err.response;
  }
};
