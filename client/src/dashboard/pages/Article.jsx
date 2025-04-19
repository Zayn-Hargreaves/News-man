import { FaEye } from 'react-icons/fa'
import { Link, useNavigate } from 'react-router-dom'
import React, { useState, useEffect } from 'react';
import categoryService from '../../service/categoryService';
import newsService from '../../service/newsService';
import { flattenTree } from '../../helper';
const Article = () => {
    const navigate = useNavigate()
    const [categories, setCategories] = useState([]);
    const [recentNews, setRecentNews] = useState([]);
    const [filter, setFilter] = useState({
        status: '',
        category: '',
    });
    const [currentPage, setCurrentPage] = useState(1);
    const [newsPerPage] = useState(5);
    const [searchTerm, setSearchTerm] = useState(''); // State cho từ khóa tìm kiếm
    const [totalPages, setTotalPages] = useState(1)

    useEffect(() => {
        // Load stats và categories chỉ một lần khi component mount
        const fetchInitialData = async () => {
            try {
                const { data } = await categoryService.fetchParentCategory()
                const formattedCategories = flattenTree(data?.metadata?.metadata) || []
                setCategories(formattedCategories);
            } catch (error) {
                console.error('Error fetching initial data:', error);
            }
        };

        fetchInitialData();
    }, []);

    const fetchRecentNews = async () => {
        try {
            const params = {
                status: filter.status,
                category: filter.category,
                search: searchTerm, // Dùng từ khóa tìm kiếm từ state
                page: currentPage,
                limit: newsPerPage,
            }
            const { data } = await newsService.fetchNews(params)
            const recentNewsData = data?.metadata?.metadata?.articles || []
            const currentPageData = data?.metadata?.metadata?.currentPage || 1
            const totalPagesData = data?.metadata?.metadata?.totalPages || 1
            setCurrentPage(currentPageData)
            setTotalPages(totalPagesData)
            setRecentNews(recentNewsData);
        } catch (error) {
            console.error('Error fetching recent news:', error);
        }
    };




    useEffect(() => {
        fetchRecentNews();
    }, [filter, currentPage, newsPerPage]);

    const handleFilterChange = (key, value) => {
        setFilter((prev) => ({
            ...prev,
            [key]: value,
        }));
        setCurrentPage(1); // Reset về trang đầu khi filter thay đổi
    };

    const handleSearch = () => {
        setCurrentPage(1); // Reset về trang đầu khi tìm kiếm
        fetchRecentNews();
    };
    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page)
        }
    }
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
    }
    const handleDelete = async (newsId) => {
        try {
            await newsService.deleteNews(id)
            setRecentNews((prev) => prev.filter((news) => news.id !== newsId));
        } catch (error) {
            console.error('Error deleting news:', error);
        }
    };
    const handleStatusToggle = async (newss) => {
        try {
            const newStatus = newss.status === 'active' ? 'inactive' : 'active';
            await newsService.changeStatus([newss.id], newStatus)
            setRecentNews((prev) =>
                prev.map((news) =>
                    news.id === newss.id ? { ...news, status: newStatus } : news
                )
            );
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };
    return (
        <div className="mt-2">
            <div className="bg-white p-4 mt-5">
                <div className="flex gap-4">
                    <div className="flex flex-col">
                        <label className="text-sm">Status</label>
                        <select
                            value={filter.status}
                            onChange={(e) => handleFilterChange('status', e.target.value)}
                            className="border p-2 rounded-md"
                        >
                            <option value="">All</option>
                            <option value="active">Active</option>
                            <option value="pending">Pending</option>
                            <option value="deactive">Deactive</option>
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
                            {categories.map((cat) => (
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
                                placeholder="Search articles..."
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
            <div className='bg-white p-4 mt-5'>
                <div className='flex justify-between items-center pb-4'>
                    <h2>Recent News</h2>
                    <button
                        onClick={() => navigate('/admin/article/create')} // Navigate to create source page
                        className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 ml-auto"
                    >
                        Create News
                    </button>
                </div>
                <div className='relative overflow-x-auto p-4'>
                    <table className='w-full text-sm text-left text-slate-600'>
                        <thead className='text-xs text-gray-700 uppercase bg-gray-50'>
                            <tr>
                                <th className='px-7 py-3'>No</th>
                                <th className='px-7 py-3'>Title</th>
                                <th className='px-7 py-3'>Image</th>
                                <th className='px-7 py-3'>Category</th>
                                <th className='px-7 py-3'>Description</th>
                                <th className='px-7 py-3'>Date</th>
                                <th className='px-7 py-3'>Status</th>
                                <th className='px-7 py-3'>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentNews.map((news, i) => (
                                <tr key={i} className='bg-white border-b'>
                                    <td className='px-6 py-4'>{indexOfFirstNews + i + 1}</td>
                                    <td className='px-6 py-4'>{news.title}</td>
                                    <td className='px-6 py-4'>
                                        <img className='w-[40px] h-[40px]' src={news.image} alt={news.title} />
                                    </td>
                                    <td className='px-6 py-4'>{news.category}</td>
                                    <td className='px-6 py-4'>{news.description}</td>
                                    <td className='px-6 py-4'>{news.date}</td>
                                    <td className='px-6 py-4'>
                                        <span
                                            className={`px-2 py-[2px] ${news.status === 'active'
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-gray-100 text-gray-800'
                                                } rounded-lg text-xs cursor-pointer`}
                                            onClick={() => handleStatusToggle(news)}
                                        >
                                            {news.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-4">
                                        <div className="flex gap-x-4">
                                            <button
                                                onClick={() => navigate(`/admin/article/detail/${news.id}`)}
                                                className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                                            >
                                                <FaEye />
                                            </button>
                                            <button
                                                onClick={() => navigate(`/admin/article/edit/${news.id}`)}
                                                className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                                            >
                                                <FaEdit />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(source.id)}
                                                className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                                            >
                                                <FaTrash />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                            }
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
    )
}

export default Article