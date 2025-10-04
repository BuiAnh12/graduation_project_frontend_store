import publicApi from "./instances/publicApi";

export const registerStore = async (data) => {
  try {
    const response = await publicApi.post("/store/register", data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (err) {
    throw err.response;
  }
};
