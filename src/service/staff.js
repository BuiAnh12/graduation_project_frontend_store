import publicApi from "./instances/publicApi";

export const checkEmail = async (email) => {
  try {
    const res = await publicApi.post("/staff/check-email", {
      email,
    });
    return res.data;
  } catch (err) {
    throw err.response;
  }
};
