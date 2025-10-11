export const StoreRoles = Object.freeze({
  STORE_OWNER: "STORE_OWNER",
  MANAGER: "MANAGER",
  STAFF: "STAFF",
});

export const StoreRoleOptions = [
  { value: StoreRoles.MANAGER, label: "Quản lý" },
  { value: StoreRoles.STAFF, label: "Nhân viên" },
];
