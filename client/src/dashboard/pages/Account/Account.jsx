import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import accountService from "../../../service/accountService";
import { FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import profile from "../../../assets/profile.png"
const Account = () => {
    const [accounts, setAccounts] = useState([]);
    const [selectedAccounts, setSelectedAccounts] = useState([]);
    const [changeStatus, setChangeStatus] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        const fetchAccounts = async () => {
            try {
                const { data } = await accountService.fetchAccount();
                console.log(data.metadata.metadata)
                const accountData = data?.metadata?.metadata || []
                setAccounts(accountData);
            } catch (error) {
                console.error("Error fetching accounts:", error);
            }
        };
        fetchAccounts();
    }, []);

    const toggleSelectAll = () => {
        setSelectedAccounts(prevSelected =>
            prevSelected.length === accounts.length ? [] : accounts.map(account => account.id)
        );
    };

    const toggleSelectAccount = (id) => {
        setSelectedAccounts(prevSelected =>
            prevSelected.includes(id)
                ? prevSelected.filter(accountId => accountId !== id)
                : [...prevSelected, id]
        );
    };

    const handleChangeStatus = async () => {
        if (!changeStatus || selectedAccounts.length === 0) return;
        try {
            await accountService.changeStatus(selectedAccounts, changeStatus);
            setAccounts(prev => prev.map(account =>
                selectedAccounts.includes(account.id) ? { ...account, status: changeStatus } : account
            ));
            setSelectedAccounts([]);
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
    const handleDeleteAccount = async (id) => {
        try {
            await accountService.deleteAccount(id);
            setAccounts(prev => prev.filter(account => account.id !== id));
        } catch (error) {
            console.error("Error deleting account:", error);
        }
    };

    const handleStatusClick = async (id, currentStatus) => {
        if (loading) return;
        const newStatus = currentStatus === "active" ? "inactive" : "active";
        setLoading(true);
        try {

            await accountService.changeStatus(id, newStatus);
            setAccounts(prev => prev.map(account =>
                account.id === id ? { ...account, status: newStatus } : account
            ));
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
                        <select value={changeStatus} onChange={(e) => setChangeStatus(e.target.value)} className="border p-2 rounded-md">
                            <option value="">Select Status</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                        <button onClick={handleChangeStatus} disabled={!changeStatus || selectedAccounts.length === 0} className={`px-4 py-2 text-white rounded-md ${changeStatus && selectedAccounts.length > 0 ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-300 cursor-not-allowed'}`}>
                            Apply
                        </button>
                    </div>
                </div>
            </div>

            <div className="bg-white p-4 mt-5">
                <div className="flex justify-between items-center pb-4">
                    <h2 className="text-lg font-bold pb-4">Account List</h2>
                    <button onClick={() => navigate('/admin/account/create')} className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 ml-auto">
                        Create Account
                    </button>
                </div>
                <div className="relative overflow-x-auto">
                    <table className="w-full text-sm text-left text-slate-600">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                                <th className="px-4 py-3">
                                    <input type="checkbox" checked={accounts.length > 0 && selectedAccounts.length === accounts.length} onChange={toggleSelectAll} />
                                </th>
                                <th className="px-4 py-3">No</th>
                                <th className="px-4 py-3">Name</th>
                                <th className="px-4 py-3">Avatar</th>
                                <th className="px-4 py-3">Category</th>
                                <th className="px-4 py-3">Role</th>
                                <th className="px-4 py-3">Status</th>
                                <th className="px-4 py-3">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {accounts.map((account, i) => (
                                <tr key={account.id || i} className="bg-white border-b">
                                    <td className="px-4 py-4">
                                        <input type="checkbox" checked={selectedAccounts.includes(account.id)} onChange={() => toggleSelectAccount(account.id)} />
                                    </td>
                                    <td className="px-4 py-4">{i + 1}</td>
                                    <td className="px-4 py-4">{account.name}</td>
                                    <td className="px-4 py-4">
                                        <img className="w-10 h-10 rounded-full cursor-pointer" src={account.avatar === null ? profile : account.avatar} alt={account.name} />
                                    </td>
                                    <td className="px-4 py-4">{account["category.title"]}</td>
                                    <td className="px-4 py-4">{account["role.title"]}</td>
                                    <td className="px-4 py-4 cursor-pointer" onClick={() => handleStatusClick(account.id, account.status)}>
                                        <span className={`px-2 py-[2px] ${account.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"} rounded-lg text-xs`}>{account.status}</span>
                                    </td>
                                    <td className="px-4 py-4 flex gap-2">
                                        <button onClick={() => navigate(`/admin/account/detail/${account.id}`)} className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600">
                                            <FaEye />
                                        </button>
                                        <button onClick={() => navigate(`/admin/account/edit/${account.id}`)} className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">
                                            <FaEdit />
                                        </button>
                                        <button onClick={() => handleDeleteAccount(account.id)} className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600">
                                            <FaTrash />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>

                    </table>
                </div>
            </div>
        </div>
    );
};

export default Account;
