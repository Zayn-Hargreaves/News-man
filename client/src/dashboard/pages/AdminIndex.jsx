import { FaEye } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import statsService from '../../service/statsService';
import newsService from '../../service/newsService';
import { convertDateTime } from '../../utils/date.utils';
const AdminIndex = () => {
  const [stats, setStats] = useState({
    totalNews: 0,
    inactiveNews: 0,
    activeNews: 0,
    totalAccount: 0,
    totalUser: 0,
  });
  const [recentNews, setRecentNews] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [newsPerPage] = useState(5);
  useEffect(() => {
    // Load stats và categories chỉ một lần khi component mount
    const fetchInitialData = async () => {
      try {
        const {data} = await statsService.fetchStats()
        setStats(data.metadata.metadata);
      } catch (error) {
        console.error('Error fetching initial data:', error);
      }
    };

    fetchInitialData();
  }, []);

  const fetchRecentNews = async () => {
    try {
      const params = {
        page: currentPage,
        limit: newsPerPage,
      };
      const {data} = await newsService.fetchNews(params)
      setRecentNews(data.metadata.metadata.articles);
    } catch (error) {
      console.error('Error fetching recent news:', error);
    }
  };


  useEffect(() => {
    fetchRecentNews();
  }, [currentPage, newsPerPage]);

  
  const totalPages = Math.ceil(recentNews.length / newsPerPage);
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="mt-2">
      {/* Hiển thị stats */}
      <div className="grid grid-cols-5 gap-x-4">
        {/* Render các ô thống kê */}
        <div className="w-full p-8 flex justify-center flex-col rounded-md items-center gap-y-2 bg-white text-slate-700">
          <span className="text-xl font-bold">{stats.totalNews}</span>
          <span className="text-md">Total News</span>
        </div>
        <div className='w-full p-8 flex justify-center flex-col rounded-md items-center gap-y-2 bg-white text-slate-700'>
          <span className='text-xl font-bold'>{stats.inactiveNews}</span>
          <span className='text-md'>Inactive News</span>
        </div>
        <div className='w-full p-8 flex justify-center flex-col rounded-md items-center gap-y-2 bg-white text-slate-700'>
          <span className='text-xl font-bold'>{stats.activeNews}</span>
          <span className='text-md'>Active News</span>
        </div>
        <div className='w-full p-8 flex justify-center flex-col rounded-md items-center gap-y-2 bg-white text-slate-700'>
          <span className='text-xl font-bold'>{stats.totalAccount}</span>
          <span className='text-md'>Total Account</span>
        </div>
        <div className='w-full p-8 flex justify-center flex-col rounded-md items-center gap-y-2 bg-white text-slate-700'>
          <span className='text-xl font-bold'>{stats.totalUser}</span>
          <span className='text-md'>Total User</span>
        </div>
        {/* Các ô thống kê khác tương tự */}
      </div>

      <div className='bg-white p-4 mt-5'>
        <div className='flex justify-between items-center pb-4'>
          <h2>Recent News</h2>
        </div>
        <div className='relative overflow-x-auto p-4'>
          <table className='w-full text-sm text-left text-slate-600'>
            <thead className='text-xs text-gray-700 uppercase bg-gray-50'>
              <tr>
                <th className='px-7 py-3'>No</th>
                <th className='px-7 py-3'>Title</th>
                <th className='px-7 py-3'>Thumbnail</th>
                <th className='px-7 py-3'>Category</th>
                <th className='px-7 py-3'>Date</th>
                <th className='px-7 py-3'>Status</th>
                <th className='px-7 py-3'>Active</th>
              </tr>
            </thead>
            <tbody>
              {
                recentNews.map((news, i) => (
                  <tr key={i} className='bg-white border-b'>
                    <td className='px-6 py-4'>{indexOfFirstNews + i + 1}</td>
                    <td className='px-6 py-4'>{news.title}</td>
                    <td className='px-6 py-4'>
                      <img className='w-[40px] h-[40px]' src={news.image} alt={news.title} />
                    </td>
                    <td className='px-6 py-4'>{news.categoryTitle}</td>
                    <td className='px-6 py-4'>{convertDateTime(news.date)}</td>
                    <td className='px-6 py-4'>
                      <span className={`px-2 py-[2px] ${news.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'} rounded-lg text-xs cursor-pointer`}>
                        {news.status}
                      </span>
                    </td>
                    <td className='px-6 py-4'>
                      <div className='flex justify-start items-center gap-x-4 text-white'>
                        <Link className='p-[6px] bg-green-500 rounded hover:shadow-lg hover:shadow-green-500/50'><FaEye /></Link>
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
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-l-md hover:bg-gray-400"
          >
            Previous
          </button>

          {pageNumbers.map((number) => (
            <button
              key={number}
              onClick={() => paginate(number)}
              className={`px-4 py-2 text-gray-700 hover:bg-gray-200 ${currentPage === number ? 'font-bold text-blue-500' : ''}`}
            >
              {number}
            </button>
          ))}

          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-r-md hover:bg-gray-400"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdminIndex;
