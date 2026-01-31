const RESOURCES = [
  "cars",
  "car-models",
  "clients",
  "employees",
  "inquiries",
  "reservations",
  "sales",
  "transactions",
  "inspections",
  "locations",
  "tasks",
  "events",
  "roles",
  "permissions",
  "acl",
  "notifications",
];

const ACTIONS = ["read", "write", "delete", "*"];

export { RESOURCES, ACTIONS };
export * from "./aclConstants";
