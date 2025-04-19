import axiosInstance from "./axiosClient";
const accountService = {
    fetchAccount: async () => {
        return await axiosInstance.get("/admin/account")
    },
    changeStatus: async (id, status) => {
        return await axiosInstance.put(`/admin/account/change-status/${id}/${status}`)
    },
    addAccount: async (formData) => {
        return await axiosInstance.post("/admin/account/create", formData, {
            headers: {
                "Content-Type": "application/json",
            },
        })
    },
    fetchAccountDetail: async (id) => {
        return await axiosInstance.post(`/admin/account/${id}`)
    },
    editAccountForAdmin: async (id, formData) => {
        return await axiosInstance.patch(`/admin/account/admin-edit/${id}`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        })
    },
    changeMulti: async (ids, status) => {
        return await axiosInstance.patch("/admin/account/change-multi", {
            ids,
            status,
        });
    },
    editAccount: async (id, formData) => {
        return axiosInstance.patch(`/admin/account/edit/${id}`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        })
    },
    deleteAccount: async(id)=>{
        return axiosInstance.delete(`/admin/account/delete/${id}`)
    }

}
export default accountService