import axiosInstance from "./axiosClient"

const userService ={
    fetchUser:async()=>{
        return await axiosInstance.get("/admin/user")
    },
    changeMulti: async (ids, status) => {
        return await axiosInstance.patch("/admin/user/change-multi", {
            ids,
            status,
        });
    },
    changeStatus:async(id, status)=>{
        return await axiosInstance.put(`/admin/user/change-status/${id}/${status}`)
    },
    deleteUser:async(id)=>{
        return await axiosInstance.delete(`/admin/user/delete/${id}`)
    }
}

export default userService