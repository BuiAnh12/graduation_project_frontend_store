import publicApi from "./instances/publicApi";

export const getAllTags = async () => {
  try {
    const res = await publicApi.get(`/tags/all`);
    return res.data;
  } catch (err) {
    throw err.response;
  }
};

export const predictTags = async (file) => {
  try {
    const formData = new FormData();
    formData.append("image", file);

    const res = await publicApi.post(`/recommend/tag/predict`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  } catch (error) {
    throw err.response;
  }
};
