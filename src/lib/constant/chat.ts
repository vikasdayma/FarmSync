import { Role } from "@/generated/prisma/client";
export const roleChatMap: Record<Role, Role[]> = {
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
  ],
  SUPER_ADMIN: []   
};