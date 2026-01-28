import { api } from "@/lib/api/axios";
import { ResourceType, ResourceACL, ResourceACLRequest } from "../../types";

export const resourceACLService = {
  /**
   * Get ACLs for a specific resource
   * GET /api/v1/rbac/acl/{resourceType}/{resourceId}
   */
  getResourceACLs: async (
    resourceType: ResourceType,
    resourceId: number
  ): Promise<ResourceACL[]> => {
    const response = await api.get(`/rbac/acl/${resourceType}/${resourceId}`);
    return response.data;
  },

  /**
   * Grant access to a resource for an employee or role
   * POST /api/v1/rbac/acl/{resourceType}/{resourceId}
   */
  grantResourceAccess: async (
    resourceType: ResourceType,
    resourceId: number,
    data: ResourceACLRequest
  ): Promise<ResourceACL> => {
    const response = await api.post(
      `/rbac/acl/${resourceType}/${resourceId}`,
      data
    );
    return response.data;
  },

  /**
   * Remove ACL entry
   * DELETE /api/v1/rbac/acl/{id}
   */
  revokeResourceAccess: async (id: number): Promise<void> => {
    await api.delete(`/rbac/acl/${id}`);
  },

  /**
   * Remove all ACL entries for a resource (Super Admin only)
   * DELETE /api/v1/rbac/acl/{resourceType}/{resourceId}
   */
  revokeAllResourceAccess: async (
    resourceType: ResourceType,
    resourceId: number
  ): Promise<void> => {
    await api.delete(`/rbac/acl/${resourceType}/${resourceId}`);
  },
};
