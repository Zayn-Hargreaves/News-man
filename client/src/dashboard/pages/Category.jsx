import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import categoryService from "../../service/categoryService";
import { flattenTree } from "../../helper";

const Category = () => {
    const [categories, setCategories] = useState([]);
    const [filter, setFilter] = useState({ status: "", category: "" });
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [searchTerm, setSearchTerm] = useState("");
    const [categoriesPerPage] = useState(5);
    const navigate = useNavigate();
    const [parentCategory, setParentCategory] = useState([]);

    
    

    useEffect(() => {
        const fetchParentCategories = async () => {
            try {
                const { data } = await categoryService.fetchParentCategory();
                if (data.metadata && data.metadata.metadata) {
                    const formattedCategories = flattenTree(data.metadata.metadata);
                    setParentCategory(formattedCategories);
                }
            } catch (error) {
                console.error("Error fetching parent categories:", error);
            }
        };

        fetchParentCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const params = {
                status: filter.status,
                parentCategory: filter.category,
                search: searchTerm,
                page: currentPage,
                limit: categoriesPerPage,
            };
            const { data } = await categoryService.fetchCategory(params);
            const categoriesData = data?.metadata?.metadata?.categories || [];
            const currentPageData = data?.metadata?.metadata?.currentPage || 1;
            const totalPagesData = data?.metadata?.metadata?.totalPages || 1;

            setCategories(categoriesData);
            setCurrentPage(currentPageData);
            setTotalPages(totalPagesData);
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, [filter, currentPage]);

    const handleFilterChange = (key, value) => {
        setFilter((prev) => ({ ...prev, [key]: value }));
        setCurrentPage(1);
        fetchCategories();
    };

    const handleSearch = () => {
        setCurrentPage(1);
        fetchCategories()
    };

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const handleDeleteCategory = async (id) => {
        try {
            await categoryService.deleteCategory(id);

            // Cập nhật danh sách sau khi xóa
            setCategories((prevCategory) => prevCategory.filter((cate) => cate.id !== id));
        } catch (error) {
            console.error("Error deleting cate:", error);
        }
    };
    const handleStatusToggle = async (cate) => {
        try {
            const newStatus = cate.status === 'active' ? 'inactive' : 'active';
            await categoryService.changeStatus([cate.id], newStatus);

            // Cập nhật trạng thái trong danh sách
            setCategories((prevCategory) =>
                prevCategory.map((item) =>
                    item.id === cate.id ? { ...item, status: newStatus } : item
                )
            );
        } catch (error) {
            console.error("Error toggling status:", error);
        }
    };
    return (
        <div className="mt-2">
            {/* Bộ lọc và tìm kiếm */}
            <div className="bg-white p-4 mt-5">
                <div className="flex gap-4">
                    <div className="flex flex-col">
                        <label className="text-sm">Status</label>
                        <select
                            value={filter.status}
                            onChange={(e) => handleFilterChange("status", e.target.value)}
                            className="border p-2 rounded-md"
                        >
                            <option value="">All</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </div>

                    <div className="flex flex-col">
                        <label className="text-sm">Parent Category</label>
                        <select
                            value={filter.category}
                            onChange={(e) => handleFilterChange("category", e.target.value)}
                            className="border p-2 rounded-md"
                        >
                            <option value="">All</option>
                            {parentCategory.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.title}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex flex-col ml-auto w-1/3">
                        <label className="text-sm">Search</label>
                        <div className="flex">
                            <input
                                type="text"
                                placeholder="Search categories..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="border p-2 rounded-l-md flex-grow"
                            />
                            <button
                                onClick={handleSearch}
                                className="px-4 py-2 bg-blue-500 text-white rounded-r-md hover:bg-blue-600"
                            >
                                Search
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Danh sách danh mục */}
            <div className="bg-white p-4 mt-5">
                <div className="flex justify-between items-center pb-4">
                    <h2 className="text-lg font-bold pb-4">Category List</h2>
                    <button
                        onClick={() => navigate('/admin/category/create')}
                        className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 ml-auto"
                    >
                        Create Category
                    </button>
                </div>
                <div className="relative overflow-x-auto p-4">
                    <table className="w-full text-sm text-left text-gray-600">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                                <th className="px-6 py-3">No</th>
                                <th className="px-6 py-3">Title</th>
                                <th className="px-6 py-3">Parent Category</th>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {categories.length > 0 ? (
                                categories.map((cat, i) => (
                                    <tr key={cat.id} className="bg-white border-b">
                                        <td className="px-6 py-4">{(currentPage - 1) * categoriesPerPage + i + 1}</td>
                                        <td className="px-6 py-4">{cat.title}</td>
                                        <td className="px-6 py-4">{cat['parent.title'] || ""}</td>
                                        <td className="px-6 py-4">
                                            <span
                                                className={`px-2 py-1 text-xs rounded-lg ${cat.status === "active"
                                                    ? "bg-green-100 text-green-800"
                                                    : "bg-red-100 text-red-800"
                                                    }`}
                                                onClick={() => handleStatusToggle(cat)}
                                            >
                                                {cat.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="flex gap-x-4">
                                                <button onClick={() => navigate(`/admin/category/edit/${cat.id}`)} className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">
                                                    <FaEdit />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteCategory(cat.id)}
                                                    className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                                                >
                                                    <FaTrash />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>

                                ))

                            ) : (
                                <tr>
                                    <td colSpan="5" className="text-center py-4 text-gray-500">
                                        No categories found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
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

export default Category;
