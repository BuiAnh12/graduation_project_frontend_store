import publicApi from "./instances/publicApi";

export const getAllTags = async () => {
  try {
    const res = await publicApi.get(`/tags/all`);
    return res.data;
  } catch (err) {
    throw err.response.data || err.response;
  }
};
