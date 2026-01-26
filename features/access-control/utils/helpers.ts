import { Shield, Eye, Edit, User, Users, Building2 } from "lucide-react";
import type { SubjectType, AccessLevel } from "../types";

const getAccessIcon = (level: AccessLevel) => {
  switch (level) {
    case "READ":
      return Eye;
    case "WRITE":
      return Edit;
    case "ADMIN":
      return Shield;
    default:
      return Eye;
  }
};

const getAccessColor = (level: AccessLevel) => {
  switch (level) {
    case "READ":
      return "text-blue-600";
    case "WRITE":
      return "text-orange-600";
    case "ADMIN":
      return "text-red-600";
    default:
      return "text-gray-600";
  }
};

const getSubjectIcon = (type: SubjectType) => {
  switch (type) {
    case "EMPLOYEE":
      return User;
    case "ROLE":
      return Users;
    case "DEPARTMENT":
      return Building2;
    default:
      return User;
  }
};

const getSubjectColor = (type: SubjectType) => {
  switch (type) {
    case "EMPLOYEE":
      return "text-blue-600";
    case "ROLE":
      return "text-purple-600";
    case "DEPARTMENT":
      return "text-green-600";
    default:
      return "text-gray-600";
  }
};

export { getAccessIcon, getAccessColor, getSubjectIcon, getSubjectColor };
