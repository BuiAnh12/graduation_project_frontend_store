import authApi from "./instances/authApi";

// Revenue
export const getRevenueSummary = async () => {
  try {
    const res = await authApi.get("/statistics/store/revenue/summary");
    return res.data;
  } catch (error) {
    throw error.response;
  }
};

export const getRevenueByDay = async (from, to) => {
  try {
    const res = await authApi.get("/statistics/store/revenue/by-day", {
      params: { from, to },
    });
    return res.data;
  } catch (error) {
    console.error("Get revenue by day error:", error);
    return error.response?.data || { message: "Unknown error occurred" };
  }
};

export const getRevenueByItem = async (limit) => {
  try {
    const res = await authApi.get("/statistics/store/revenue/by-item", {
      params: { limit },
    });
    return res.data;
  } catch (error) {
    console.error(error);
    throw error.response;
  }
};

export const getRevenueByCategory = async () => {
  try {
    const res = await authApi.get("/statistics/store/revenue/by-category");
    return res.data;
  } catch (error) {
    console.error(error);
    throw error.response;
  }
};

// Orders
export const getOrderStatusRate = async () => {
  try {
    const res = await authApi.get("/statistics/store/order/status-rate");
    return res.data;
  } catch (error) {
    console.error(error);
    throw error.response;
  }
};

export const getOrderSummaryStats = async () => {
  try {
    const res = await authApi.get("/statistics/store/order/summary");
    return res.data;
  } catch (error) {
    console.error(error);
    throw error.response;
  }
};

export const getOrdersOverTime = async (from, to) => {
  try {
    const res = await authApi.get("/statistics/store/order/over-time", {
      params: { from, to },
    });
    return res.data;
  } catch (error) {
    console.error(error);
    throw error.response;
  }
};

export const getOrderStatusDistribution = async (from, to) => {
  try {
    const res = await authApi.get(
      "/statistics/store/order/status-distribution",
      {
        params: { from, to },
      }
    );
    return res.data;
  } catch (error) {
    console.error(error);
    throw error.response;
  }
};

export const getOrdersByTimeSlot = async (limit) => {
  try {
    const res = await authApi.get("/statistics/store/orders/by-time-slot");
    return res.data;
  } catch (error) {
    console.error(error);
    throw error.response;
  }
};

// Items
export const getTopSellingItems = async (limit) => {
  try {
    const res = await authApi.get("/statistics/store/top-selling-items", {
      params: { limit },
    });
    return res.data;
  } catch (error) {
    console.error(error);
    throw error.response;
  }
};

export const getRevenueContributionByItem = async (limit) => {
  try {
    const res = await authApi.get(
      "/statistics/store/items/revenue-contribution",
      {
        params: { limit },
      }
    );
    return res.data;
  } catch (error) {
    console.error(error);
    throw error.response;
  }
};

// Customers
export const getNewCustomers = async () => {
  try {
    const res = await authApi.get("/statistics/store/customers/new");
    return res.data;
  } catch (error) {
    console.error(error);
    throw error.response;
  }
};

export const getReturningCustomerRate = async () => {
  try {
    const res = await authApi.get("/statistics/store/customers/returning-rate");
    return res.data;
  } catch (error) {
    console.error(error);
    throw error.response;
  }
};

export const getAverageSpendingPerOrder = async () => {
  try {
    const res = await authApi.get(
      "/statistics/store/customers/average-spending"
    );
    return res.data;
  } catch (error) {
    console.error(error);
    throw error.response;
  }
};

export const getVoucherUsageSummary = async (from, to) => {
  try {
    const res = await authApi.get("/statistics/store/vouchers/usage-summary", {
      params: { from, to },
    });
    return res.data;
  } catch (error) {
    console.error(error);
    throw error.response;
  }
};

export const getTopUsedVouchers = async (limit, from, to) => {
  try {
    const res = await authApi.get("/statistics/store/vouchers/top-used", {
      params: { limit, from, to },
    });
    return res.data;
  } catch (error) {
    console.error(error);
    throw error.response;
  }
};

export const getVoucherRevenueImpact = async (from, to) => {
  try {
    const res = await authApi.get("/statistics/store/vouchers/revenue-impact", {
      params: { from, to },
    });
    return res.data;
  } catch (error) {
    console.error(error);
    throw error.response;f
  }
};
