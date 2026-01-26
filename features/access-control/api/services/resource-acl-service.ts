import { api } from "@/lib/api/axios";
import { ResourceType, ResourceACL, ResourceACLRequest } from "../../types";

export const resourceACLService = {
  /**
   * Get ACLs for a specific resource
   * GET /api/v1/rbac/acl/resource/{resourceType}/{resourceId}
   */
  getResourceACLs: async (
    resourceType: ResourceType,
    resourceId: string
  ): Promise<ResourceACL[]> => {
    const response = await api.get(`/rbac/acl/${resourceType}/${resourceId}`);
    return response.data;
  },

  /**
   * Grant access to a resource for an employee or role
   * POST /api/v1/rbac/acl
   */
  grantResourceAccess: async (
    data: ResourceACLRequest
  ): Promise<ResourceACL> => {
    const response = await api.post(`/rbac/acl`, data);
    return response.data;
  },

  /**
   * Update access level for an ACL
   * PUT /api/v1/rbac/acl/{id}
   */
  updateResourceAccess: async (
    id: number,
    data: ResourceACLRequest
  ): Promise<ResourceACL> => {
    const response = await api.put(`/rbac/acl/${id}`, data);
    return response.data;
  },

  /**
   * Remove ACL entry
   * DELETE /api/v1/rbac/acl/{id}
   */
  revokeResourceAccess: async (id: number): Promise<void> => {
    await api.delete(`/rbac/acl/${id}`);
  },
};
