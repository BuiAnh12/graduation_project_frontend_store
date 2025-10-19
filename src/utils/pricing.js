export const formatVND = (n) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(n || 0);

export const getDishCatalogPrice = (dishId, catalogMap, fallback) => {
  const cat = catalogMap?.[dishId];
  return cat?.price ?? fallback ?? 0;
};

// line = { dishId, quantity, toppings[], dish?, price? }
// catalogMap = { [dishId]: dishFromCatalog }
export const lineSubtotal = (line, catalogMap) => {
  const basePrice = getDishCatalogPrice(
    line.dishId,
    catalogMap,
    line.dish?.price ?? line.price
  );
  const toppingsSum = (line.toppings || []).reduce(
    (s, t) => s + (t.price || 0),
    0
  );
  return (line.quantity || 0) * (basePrice + toppingsSum);
};

// order = { shippingFee, totalDiscount }
export const computeTotals = (items, order, catalogMap) => {
  const subtotalPrice = (items || []).reduce(
    (s, it) => s + lineSubtotal(it, catalogMap),
    0
  );
  const finalTotal =
    subtotalPrice + (order?.shippingFee || 0) - (order?.totalDiscount || 0);
  return { subtotalPrice, finalTotal };
};
