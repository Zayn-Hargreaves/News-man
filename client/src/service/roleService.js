import axiosInstance from "./axiosClient"

const roleService = {
    fetchRole:async()=>{
        return await axiosInstance.get("/admin/role")
    },
    createRole:async(formData)=>{
        return await axiosInstance.post("/admin/role/create",formData,{
            headers: {
                "Content-Type": "application/json",
            },
        })
    },
    fetchRoleDetail:async(roleId)=>{
        return await axiosInstance.get(`/admin/role/detail/${roleId}`)
    },
    editRole:async(id,FormData)=>{
        return await axiosInstance.patch(`/admin/role/edit/${id}`,FormData,{
            headers: {
                "Content-Type": "application/json",
            },
        })
    },
    deleteRole:async(id)=>{
        return await axiosInstance.delete(`/admin/role/delete/${id}`)
    }
}
export default roleService