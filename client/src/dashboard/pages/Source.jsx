import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import sourceService from '../../service/sourceService';
import { FaEdit, FaEye, FaTrash } from "react-icons/fa"
const Source = () => {
  const [Sources, setSources] = useState([]);
  const [selectedSources, setSelectedSources] = useState([]);
  const [changeStatus, setChangeStatus] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSources = async () => {
      try {
        const { data } = await sourceService.fetchSource();
        setSources(data.metadata.metadata);
      } catch (error) {
        console.error("Error fetching sources:", error);
      }
    };

    fetchSources();
  }, []);

  const toggleSelectAll = () => {
    setSelectedSources((prevSelected) =>
      prevSelected.length === Sources.length ? [] : Sources.map((source) => source.id)
    );
  };

  const toggleSelectSource = (id) => {
    setSelectedSources((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((sourceId) => sourceId !== id)
        : [...prevSelected, id]
    );
  };

  const handleChangeStatus = async () => {
    try {
      await sourceService.changeMulti(selectedSources, changeStatus)
      const updatedSources = Sources.map((source) =>
        selectedSources.includes(source.id)
          ? { ...source, status: changeStatus }
          : source
      );

      setSources(updatedSources);
      setSelectedSources([]);
      alert("Status updated successfully!");
    } catch (error) {
      console.error("Error changing status:", error);
    }
  };
  const handleStatusToggle = async (source) => {
    try {
      const newStatus = source.status === 'active' ? 'inactive' : 'active';
      await sourceService.changeStatus([source.id], newStatus);

      // Cập nhật trạng thái trong danh sách
      setSources((prevSources) =>
        prevSources.map((item) =>
          item.id === source.id ? { ...item, status: newStatus } : item
        )
      );
    } catch (error) {
      console.error("Error toggling status:", error);
    }
  };

  const handleDeleteSource = async (id) => {
    try {
      await sourceService.deleteSource(id);

      // Cập nhật danh sách sau khi xóa
      setSources((prevSources) => prevSources.filter((source) => source.id !== id));
    } catch (error) {
      console.error("Error deleting source:", error);
    }
  };
  return (
    <div className="mt-2">
      {/* Action Buttons */}
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
            <button
              onClick={handleChangeStatus}
              disabled={!changeStatus || selectedSources.length === 0}
              className={`px-4 py-2 text-white rounded-md ${changeStatus && selectedSources.length > 0
                ? 'bg-blue-500 hover:bg-blue-600'
                : 'bg-gray-300 cursor-not-allowed'
                }`}
            >
              Apply
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white p-4 mt-5">
        <div className="flex justify-between items-center pb-4">
          <h2 className="text-lg font-bold pb-4">Source List</h2>
          <button
            onClick={() => navigate('/admin/source/create')} // Navigate to create source page
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 ml-auto"
          >
            Create Source
          </button>
        </div>
        <div className="relative overflow-x-auto">
          <table className="w-full text-sm text-left text-slate-600">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selectedSources.length === Sources.length && Sources.length > 0}
                    onChange={toggleSelectAll}
                  />
                </th>
                <th className="px-4 py-3">No</th>
                <th className="px-4 py-3">Source</th>
                <th className="px-4 py-3">Image</th>
                <th className="px-4 py-3">Link</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {Sources.map((source, i) => (
                <tr key={source.id} className="bg-white border-b">
                  <td className="px-4 py-4">
                    <input
                      type="checkbox"
                      checked={selectedSources.includes(source.id)}
                      onChange={() => toggleSelectSource(source.id)}
                    />
                  </td>
                  <td className="px-4 py-4">{i + 1}</td>
                  <td className="px-4 py-4">{source.name}</td>
                  <td className="px-4 py-4">
                    <img className="w-[40px] h-[40px]" src={source.avatar} alt={source.title} />
                  </td>
                  <td className="px-4 py-4">{source.link}</td>
                  <td className="px-4 py-4">
                    <span
                      className={`px-2 py-[2px] ${source.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-gray-800'
                        } rounded-lg text-xs cursor-pointer`}
                      onClick={() => handleStatusToggle(source)}
                    >
                      {source.status}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex gap-x-4">
                      <button
                        onClick={() => navigate(`/admin/source/detail/${source.id}`)}
                        className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                      >
                        <FaEye />
                      </button>
                      <button
                        onClick={() => navigate(`/admin/source/edit/${source.id}`)}
                        className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDeleteSource(source.id)}
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
  );
};

export default Source;
