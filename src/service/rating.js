import authApi from "./instances/authApi";

export const getStoreRatings = async ({
  page = 1,
  limit = 10,
  replied,
  sort = "-createdAt",
}) => {
  try {
    const params = { page, limit, sort };
    if (replied !== undefined) params.replied = replied;

    const res = await authApi.get("/rating", { params });
    return res.data;
  } catch (error) {
    throw error.response;
  }
};

export const replyToRating = async (ratingId, storeReply) => {
  try {
    const res = await authApi.patch(`/rating/${ratingId}/reply`, {
      storeReply,
    });
    return res.data;
  } catch (error) {
    throw error.response;
  }
};
