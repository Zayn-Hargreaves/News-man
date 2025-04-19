import axiosInstance from "./axiosClient";

const newsService = {
    fetchNews: async (params) => {
        return await axiosInstance.get("/admin/article", { params })
    },
    changeStatus: async (id, status) => {
        return await axiosInstance.put(`/admin/article/change-status/${id}/${status}`)
    },
    deleteNews: async (id) => {
        return await axiosInstance.delete(`/admin/article/delete/${id}`)
    },
    createNews: async (formData) => {
        return await axiosInstance.post("/admin/article/create", formData, {
            headers: {
                "Content-Type": "application/json",
            },
        })
    },
    fetchNewsDetail: async (id) => {
        return await axiosInstance.get(`/admin/article/detail/:${id}`)
    },
    editNews: async (id, formData) => {
        return await axiosInstance.patch(`/admin/article/edit/${id}`, formData, {
            headers: {
                "Content-Type": "application/json",
            },
        })
    }
}

export default newsService