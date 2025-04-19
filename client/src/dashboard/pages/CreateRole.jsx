import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

import storeContext from '../../context/storeContext';
import toast from 'react-hot-toast';

import roleService from '../../service/roleService';

const CreateRole = () => {
    const { store } = useContext(storeContext);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [loader, setLoader] = useState(false);
    const navigate = useNavigate()
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoader(true);

            const {data} = await roleService.createRole({title,description})
            setLoader(false);
            toast.success(data.message);
            navigate("/admin/role")
        } catch (error) {
            setLoader(false);
            toast.error(error.response?.data?.message || 'An error occurred');
        }
    };

    return (
        <div className="bg-white rounded-md">
            <div className="flex justify-between p-4">
                <h2 className="text-xl font-medium">Create Role</h2>
            </div>
            <div className="p-4">
                <form onSubmit={handleSubmit}>
                    {/* Title Input */}
                    <div className="flex flex-col gap-y-2 mb-6">
                        <label htmlFor="title" className="text-md font-medium text-gray-600">
                            Title
                        </label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Enter role title"
                            className="px-3 py-2 rounded-md border border-gray-300 focus:border-green-500"
                            required
                        />
                    </div>

                    {/* Description Input */}
                    <div className="flex flex-col gap-y-2 mb-6">
                        <label htmlFor="description" className="text-md font-medium text-gray-600">
                            Description
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Enter role description"
                            className="px-3 py-2 rounded-md border border-gray-300 focus:border-green-500"
                            rows={3}
                            required
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loader}
                        className={`px-4 py-2 text-white rounded-md ${
                            loader ? 'bg-gray-300 cursor-not-allowed' : 'bg-purple-500 hover:bg-purple-600'
                        }`}
                    >
                        {loader ? 'Loading...' : 'Create Role'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateRole;
