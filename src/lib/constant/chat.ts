export const roleChatMap: Record<string, string[]> = {
  FARMER: [
    "AGRONOMIST",
    "SUPPLIER",
    "WAREHOUSE_MANAGER",
    "GOVERNMENT_OFFICER",
    "SUPER_ADMIN",
      "FARMER"
  ],

  AGRONOMIST: [
    "FARMER"
  ],

  SUPPLIER: [
    "FARMER",
    "WAREHOUSE_MANAGER"
  ],

  WAREHOUSE_MANAGER: [
    "FARMER",
    "SUPPLIER"
  ],

  GOVERNMENT_OFFICER: [
    "FARMER"
  ]
};