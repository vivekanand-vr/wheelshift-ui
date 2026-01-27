import { Shield, Eye, Edit, User, Users, Building2 } from "lucide-react";
import type { SubjectType, AccessLevel } from "../types";

const formatResourceName = (resource: string) =>
  resource
    .replace(/[_-]+/g, " ")
    .trim()
    .split(" ")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

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

/**
 * Get background styling for role icon based on color
 * @param color - The role color (e.g., "text-purple-600", "text-blue-600")
 * @returns Tailwind CSS classes for background and ring
 */
const getRoleIconBackground = (color: string): string => {
  if (color.includes("purple")) {
    return "bg-purple-500/10 ring-1 ring-purple-500/20";
  }
  if (color.includes("blue")) {
    return "bg-blue-500/10 ring-1 ring-blue-500/20";
  }
  if (color.includes("green")) {
    return "bg-green-500/10 ring-1 ring-green-500/20";
  }
  if (color.includes("orange")) {
    return "bg-orange-500/10 ring-1 ring-orange-500/20";
  }
  return "bg-gray-500/10 ring-1 ring-gray-500/20";
};

export {
  formatResourceName,
  getAccessIcon,
  getAccessColor,
  getSubjectIcon,
  getSubjectColor,
  getRoleIconBackground,
};
