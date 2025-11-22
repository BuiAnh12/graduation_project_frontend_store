import publicApi from "./instances/publicApi";
export const predictTagsFromImage = async (file) => {
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
    throw err.response.data || err.response;
  }
};

export const predictTagsFromText = async (data) => {
  try {
    const res = await publicApi.post(`/recommend/text/extract-tags`, data);
    return res.data;
  } catch (err) {
    throw err.response.data || err.response;
  }
};

export const generateNewDesciption = async (data) => {
  try {
    const res = await publicApi.post(
      `/recommend/text/optimize-description`,
      data
    );
    return res.data;
  } catch (err) {
    throw err.response.data || err.response;
  }
};
