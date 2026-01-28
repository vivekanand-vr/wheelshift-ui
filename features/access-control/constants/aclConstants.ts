import {
  LucideIcon,
  Eye,
  Edit,
  Shield,
  User,
  Users,
  Building2,
} from "lucide-react";
import { AccessLevel, ResourceType, SubjectType } from "../types";

const RESOURCE_TYPES: ResourceType[] = [
  "CAR",
  "CAR_MODEL",
  "CLIENT",
  "EMPLOYEE",
  "INQUIRY",
  "RESERVATION",
  "SALE",
  "TRANSACTION",
  "INSPECTION",
  "LOCATION",
  "TASK",
  "EVENT",
  "ROLE",
  "PERMISSION",
  "ACL",
  "NOTIFICATION",
];

const SUBJECT_TYPES: SubjectType[] = ["EMPLOYEE", "ROLE", "DEPARTMENT"];
const ACCESS_LEVELS: AccessLevel[] = ["READ", "WRITE", "ADMIN"];

const ACCESS_LEVEL_ICONS: Record<AccessLevel, LucideIcon> = {
  READ: Eye,
  WRITE: Edit,
  ADMIN: Shield,
};

const ACCESS_LEVEL_DESCRIPTIONS: Record<AccessLevel, string> = {
  READ: "View only access",
  WRITE: "View and modify access",
  ADMIN: "Full control including ACL management",
};

const SUBJECT_TYPE_ICONS: Record<SubjectType, LucideIcon> = {
  EMPLOYEE: User,
  ROLE: Users,
  DEPARTMENT: Building2,
};

const SUBJECT_TYPE_DESCRIPTIONS: Record<SubjectType, string> = {
  EMPLOYEE: "Grant access to a specific employee",
  ROLE: "Grant access to all employees with a role",
  DEPARTMENT: "Grant access to all employees in a department",
};

export {
  RESOURCE_TYPES,
  SUBJECT_TYPES,
  ACCESS_LEVELS,
  ACCESS_LEVEL_ICONS,
  ACCESS_LEVEL_DESCRIPTIONS,
  SUBJECT_TYPE_ICONS,
  SUBJECT_TYPE_DESCRIPTIONS,
};
