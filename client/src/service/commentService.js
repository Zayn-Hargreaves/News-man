import axiosInstance from "./axiosClient";

const commentService = {
  fetchStats: async () => {
    return await axiosInstance.get("/admin/stats/comment");
  },

  fetchComments: async (params) => {
    return await axiosInstance.get("/admin/comments", {params});
  },

  changeMulti: async (ids, status) => {
    return await axiosInstance.patch("/admin/comments/change-multi", {
      ids,
      status,
    });
  },
  changeStatus:async(id,status)=>{
    return await axiosInstance.put(`/admin/comment/${id}/${status}`)
  },
  deleteComment: async(id)=>{
    return await axiosInstance.delete(`/admin/comment/delete/${id}`)
  }
};

export default commentService;
