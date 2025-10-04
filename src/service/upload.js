import publicApi from "./instances/publicApi";

export const uploadImages = async (file) => {
  try {
    const formData = new FormData();
    formData.append("files", file);

    const res = await publicApi.post(`/upload/images`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    console.log(res);
    return res.data.data[0];
  } catch (error) {
    throw {
      status: error.response?.status,
      message: error.response?.data?.message || "Lỗi upload ảnh",
    };
  }
};
