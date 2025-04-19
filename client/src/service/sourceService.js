import axiosInstance from "./axiosClient";

const sourceService = {
    fetchSource: async () => {
        return await axiosInstance.get("/admin/source")
    },
    changeMulti: async (ids, status) => {
        return await axiosInstance.patch("/admin/source/change-multi", {
            ids,
            status,
        })
    },
    changeStatus: async (id, status) => {
        return await axiosInstance.put(`/admin/source/change-status/${id}/${status}`)
    },
    addSource: async (formData) => {
        return axiosInstance.post(`/admin/source/create`, formData, {
            headers: {
                "Content-Type": "application/json",
            },
        });
    },
    deleteSource: async (id) => {
        return await axiosInstance.delete(`/admin/source/delete/${id}`)
    },
    fetchSourceDetail: async (id) => {
        return await axiosInstance.get(`/admin/source/detail/${id}`)
    },
    editSource: async (id, formData) => {
        return axiosInstance.patch(`/admin/source/edit/${id}`, formData, {
            headers: {
                "Content-Type": "application/json",
            },
        })
    }
}
export default sourceService