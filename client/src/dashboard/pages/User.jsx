import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import userService from "../../service/userService";

const User = () => {
    const [Users, setUsers] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [changeStatus, setChangeStatus] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(0);
    const itemsPerPage = 5;

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const { data } = await userService.fetchUser();
                const userData = data?.metadata?.metadata?.users || []
                const currentPageData = data?.metadata?.metadata.currentPage || 1;
                const totalPagesData = data?.metadata?.metadata?.totalPages || 1
                setUsers(userData);
                setCurrentPage(currentPageData);
                setTotalPages(totalPagesData)
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };
        fetchUsers();
    }, []);

    // Cắt dữ liệu theo trang
    const toggleSelectAll = () => {
        setSelectedUsers(prevSelected =>
            prevSelected.length === Users.length ? [] : Users.map(user => user.id)
        );
    };

    const toggleSelectUser = (id) => {
        setSelectedUsers(prevSelected =>
            prevSelected.includes(id)
                ? prevSelected.filter(UserId => UserId !== id)
                : [...prevSelected, id]
        );
    };

    const handleChangeStatus = async () => {
        if (!changeStatus || selectedUsers.length === 0) return;
        try {
            await userService.changeStatus(selectedUsers, changeStatus);
            setUsers(prev => prev.map(user =>
                selectedUsers.includes(user.id) ? { ...user, status: changeStatus } : user
            ));
            setSelectedUsers([]);
            setChangeStatus("");
            alert("Status updated successfully!");
        } catch (error) {
            console.error("Error changing status:", error);
        }
    };
    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };
    const handleDeleteUser = async (id) => {
        try {
            await userService.deleteUser(id);
            setUsers(prev => prev.filter(user => user.id !== id));
            alert("Account deleted successfully!");
        } catch (error) {
            console.error("Error deleting account:", error);
        }
    };

    const handleStatusClick = async (id, currentStatus) => {
        if (loading) return;
        const newStatus = currentStatus === "active" ? "inactive" : "active";
        setLoading(true);
        try {
            await userService.changeStatus([id], newStatus);
            setUsers(prev => prev.map(user =>
                user.id === id ? { ...user, status: newStatus } : user
            ));
            alert("Status updated successfully!");
        } catch (error) {
            console.error("Error updating status:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mt-2">
            <div className="bg-white p-4 mb-5">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <select
                            value={changeStatus}
                            onChange={(e) => setChangeStatus(e.target.value)}
                            className="border p-2 rounded-md"
                        >
                            <option value="">Select Status</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                        <button onClick={handleChangeStatus} disabled={!changeStatus || selectedUsers.length === 0} className={`px-4 py-2 text-white rounded-md ${changeStatus && selectedUsers.length > 0 ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-300 cursor-not-allowed'}`}>
                            Apply
                        </button>
                    </div>
                </div>
            </div>

            <div className="bg-white p-4 mt-5">
                <div className="flex justify-between items-center pb-4">
                    <h2 className="text-lg font-bold pb-4">User List</h2>
                </div>
                <div className="relative overflow-x-auto">
                    <table className="w-full text-sm text-left text-slate-600">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                                <th className="px-4 py-3">
                                    <input type="checkbox" checked={User.length > 0 && selectedUsers.length === Users.length} onChange={toggleSelectAll} />
                                </th>
                                <th className="px-4 py-3">No</th>
                                <th className="px-4 py-3">Name</th>
                                <th className="px-4 py-3">Email</th>
                                <th className="px-4 py-3">Avatar</th>
                                <th className="px-4 py-3">Status</th>
                                <th className="px-4 py-3">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Users.map((user, i) => (
                                <tr key={user.id} className="bg-white border-b">
                                    <td className="px-4 py-4">
                                        <input type="checkbox" checked={selectedUsers.includes(user.id)} onChange={() => toggleSelectUser(user.id)} />
                                    </td>
                                    <td className="px-4 py-4">{indexOfFirstItem + i + 1}</td>
                                    <td className="px-4 py-4">{user.name}</td>
                                    <td className="px-4 py-4">{user.email}</td>
                                    <td className="px-4 py-4">
                                        <img className="w-[40px] h-[40px]" src={user.avatar} alt={user.name} />
                                    </td>
                                    <td className="px-4 py-4 cursor-pointer" onClick={() => handleStatusClick(account.id, account.status)}>
                                        <span className={`px-2 py-[2px] ${account.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"} rounded-lg text-xs`}>{account.status}</span>
                                    </td>
                                    <td className="px-4 py-4 flex gap-2">
                                        <button onClick={() => navigate(`/admin/user/detail/${user.id}`)} className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600">
                                            <FaEye />
                                        </button>
                                        <button onClick={() => handleDeleteUser(user.id)} className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600">
                                            <FaTrash />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="flex justify-center mt-4">

                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage <= 1} // Đảm bảo currentPage luôn >= 1
                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded-l-md hover:bg-gray-400"
                    >
                        Previous
                    </button>
                    <span className="px-4 py-2">{`${currentPage} / ${totalPages}`}</span>
                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage >= totalPages || totalPages === 1} // Đảm bảo có ít nhất 1 trang
                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded-r-md hover:bg-gray-400"
                    >
                        Next
                    </button>

                </div>
            </div>
        </div>
    );
};

export default User;
