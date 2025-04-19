import axiosInstance from "./axiosClient";

const statsService = {
    fetchStats : async()=>{
        return await axiosInstance.get("/admin/stats")
    }
}

export default statsService