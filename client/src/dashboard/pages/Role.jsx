import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import roleService from "../../service/roleService"
import { FaEdit, FaTrash } from 'react-icons/fa';

const Role = () => {
    const [Roles, setRoles] = useState([]);
    const [selectedRoles, setSelectedRoles] = useState([]);
    const [changeStatus, setChangeStatus] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const { data } = await roleService.fetchRole()
                setRoles(data.metadata.metadata);
            } catch (error) {
                console.error("Error fetching sources:", error);
            }
        };

        fetchRoles();
    }, []);


    const handleDeleteRole = async (id) => {
        try {
            await roleService.deleteRole(id);
            setRoles((prev) => prev.filter((role) => role.id !== id));
        } catch (error) {
            console.error("Error deleting account:", error);
        }
    };

    return (
        <div className="mt-2">


            {/* Table */}
            <div className="bg-white p-4 mt-5">
                <div className="flex justify-between items-center pb-4">
                    <h2 className="text-lg font-bold pb-4">Role List</h2>
                    <button
                        onClick={() => navigate('/admin/role/create')} // Navigate to create source page
                        className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 ml-auto"
                    >
                        Create Role
                    </button>
                </div>
                <div className="relative overflow-x-auto">
                    <table className="w-full text-sm text-left text-slate-600">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                                <th className="px-4 py-3">No</th>
                                <th className="px-4 py-3">Title</th>
                                <th className="px-4 py-3">Description</th>
                                <th className="px-4 py-3">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Roles.map((role, i) => (
                                <tr key={role.id} className="bg-white border-b">
                                    <td className="px-4 py-4">{i + 1}</td>
                                    <td className="px-4 py-4">{role.title}</td>
                                    <td className="px-4 py-4">{role.description}</td>
                                    <td className="px-4 py-4">
                                        <div className="flex gap-x-4">
                                            <button onClick={() => navigate(`/admin/role/edit/${role.id}`)} className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">
                                                <FaEdit />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteRole(role.id)}
                                                className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                                            >
                                                <FaTrash />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default Role