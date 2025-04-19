import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import commentService from "../../service/commentService";
import { FaTrash } from "react-icons/fa";
const Comment = () => {
  const [comments, setComments] = useState([]);
  const [selectedComments, setSelectedComments] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [commentPerPage] = useState(10);

  const [selectedStatus, setSelectedStatus] = useState("");
  const [stats, setStats] = useState({
    numOfPendingComment: 0,
    numOfReportedComment: 0,
  });

  const fetchComments = async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        limit:commentPerPage
      }
      const [statsRes, commentsRes] = await Promise.all([
        commentService.fetchStats(),
        commentService.fetchComments(params),
      ]);
    
      setStats(statsRes.data.metadata.metadata);
      setComments(commentsRes.data.metadata.metadata.comments);
      setTotalPages(commentsRes.data.metadata.metadata.totalPages);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch comments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [currentPage]);

  const handleCheckboxChange = (id) => {
    setSelectedComments((prev) =>
      prev.includes(id) ? prev.filter((commentId) => commentId !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedComments.length === comments.length) {
      setSelectedComments([]);
    } else {
      setSelectedComments(comments.map((comment) => comment.id));
    }
  };

  const updateCommentsStatus = async () => {
    if (selectedComments.length === 0) {
      toast.error("Please select at least one comment");
      return;
    }
    if (!selectedStatus) {
      toast.error("Please select a status to apply");
      return;
    }
    try {
      await commentService.updateCommentsStatus(selectedComments, selectedStatus);
      toast.success("Comments updated successfully");
      setSelectedComments([]);
      fetchComments();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update comments");
    }
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const handleStatusToggle = async (comment) => {
    try {
      const newStatus = comment.status === "approved" ? "rejected" : "approved";
      await commentService.updateCommentsStatus([comment.id], newStatus);
      setComments((prev) =>
        prev.map((item) => (item.id === comment.id ? { ...item, status: newStatus } : item))
      );
      toast.success("Comment status updated");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update comment status");
    }
  };

  const handleDeleteComment = async (id) => {
    try {
      await commentService.deleteComment(id);
      setComments((prev) => prev.filter((comment) => comment.id !== id));
      toast.success("Comment deleted successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete comment");
    }
  };
  return (
    <div className="mt-2">
      {/* Stats Section */}
      <div className="grid grid-cols-2 gap-x-4">
        <div className="w-full p-8 flex flex-col justify-center items-center bg-white rounded-md text-slate-700">
          <span className="text-xl font-bold">{stats.numOfPendingComment}</span>
          <span className="text-md">Pending Comments</span>
        </div>
        <div className="w-full p-8 flex flex-col justify-center items-center bg-white rounded-md text-slate-700">
          <span className="text-xl font-bold">{stats.numOfReportedComment}</span>
          <span className="text-md">Reported Comments</span>
        </div>
      </div>

      {/* Status Selector and Apply Button */}
      <div className="bg-white p-4 mt-5">
        <div className="flex items-center gap-4">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="border p-2 rounded-md"
          >
            <option value="">Select Status</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
          <button
            onClick={updateCommentsStatus}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Apply
          </button>
        </div>
      </div>

      {/* Comments Table */}
      <div className="bg-white p-4 mt-5">
        <table className="w-full text-sm text-left text-slate-600">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th className="px-4 py-2">
                <input
                  type="checkbox"
                  checked={selectedComments.length === comments.length}
                  onChange={handleSelectAll}
                />
              </th>
              <th className="px-4 py-2">No</th>
              <th className="px-4 py-2">Comment</th>
              <th className="px-4 py-2">Author</th>
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {comments.map((comment, index) => (
              <tr key={comment.id} className="bg-white border-b">
                <td className="px-4 py-2">
                  <input
                    type="checkbox"
                    checked={selectedComments.includes(comment.id)}
                    onChange={() => handleCheckboxChange(comment.id)}
                  />
                </td>
                <td className="px-4 py-2">{index + 1}</td>
                <td className="px-4 py-2">{comment.text}</td>
                <td className="px-4 py-2">{comment.author}</td>
                <td className="px-4 py-2">{new Date(comment.date).toLocaleDateString()}</td>
                <td className="px-4 py-2">
                  <span
                    className={`px-2 py-1 rounded-lg text-xs cursor-pointer ${comment.status === "Approved"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                      }`}
                    onClick={() => handleStatusToggle(comment)}
                  >
                    {comment.status}
                  </span>
                </td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => handleDeleteComment(comment.id)}
                    className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {loading && <div>Loading...</div>}
        {!loading && comments.length === 0 &&
          <div>
            <div colSpan="5" className="text-center py-4 text-gray-500">
              No categories found.
            </div>
          </div>
        }

        {/* Pagination */}
        <div className="flex justify-center mt-4">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-l-md hover:bg-gray-400"
          >
            Previous
          </button>
          <span className="px-4 py-2">{`${currentPage} / ${totalPages}`}</span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-r-md hover:bg-gray-400"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Comment;
