import axiosInstance from "./axiosClient";

const categoryService = {
    fetchCategory: async (params) => {
        return await axiosInstance.get("/admin/category", { params })
    },
    fetchParentCategory: async () => {
        return await axiosInstance.get("/admin/category/tree")
    },
    fetchCategoryDetail: async (id) => {
        return await axiosInstance.get(`/admin/category/detail/${id}`)
    },
    createCategory: async (formData) => {
        return await axiosInstance.post("/admin/category/create", formData, {
            headers: {
                "Content-Type": "application/json",
            },
        })
    },
    editCategory: async (id, formData) => {
        return await axiosInstance.patch(`/admin/category/edit/${id}`, formData, {
            headers: {
                "Content-Type": "application/json",
            },
        })
    },
    changeStatus: async (id, status) => {
        return await axiosInstance.put(`/admin/category/change-status/${id}/${status}`)
    },
    deleteCategory: async (id) => {
        return await axiosInstance.delete(`/admin/category/delete/${id}`)
    }

}

export default categoryService