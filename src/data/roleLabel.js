export const ROLE_LABELS = {
  STORE_OWNER: "Chủ cửa hàng",
  MANAGER: "Quản lý",
  STAFF: "Nhân viên",
};

export const getRoleNames = (roles = []) => {
  if (!roles) return "";
  if (!Array.isArray(roles)) roles = [roles];
  return roles.map((r) => ROLE_LABELS[r] || r).join(", ");
};

export const RoleOptions = [
  { value: "HR_MANAGER", label: ROLE_LABELS.HR_MANAGER },
  { value: "CUSTOMER_MANAGER", label: ROLE_LABELS.CUSTOMER_MANAGER },
  { value: "STORE_MANAGER", label: ROLE_LABELS.STORE_MANAGER },
  { value: "SHIPPER_MANAGER", label: ROLE_LABELS.SHIPPER_MANAGER },
];
