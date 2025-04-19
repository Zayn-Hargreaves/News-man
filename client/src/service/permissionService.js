import axiosInstance from "./axiosClient"

const permissionService = {
    fetchRolePermission:async()=>{
        return await axiosInstance.get("/admin/permission/role")
    },
    fetchPermission:async()=>{
        return await axiosInstance.get("/admin/permission")
    },
    addPermission:async({roleId, permissionId})=>{
        return await axiosInstance.post(`/admin/permssion/role/edit/${roleId}/${permissionId}`)
    },
    deletePermission:async({roleId,permissionId})=>{
        return await axiosInstance.delete(`/admin/permission/role/delete/${roleId}/${permissionId}`)
    }
}
export default permissionService