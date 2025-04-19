import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import storeContext from '../../context/storeContext';
import toast from 'react-hot-toast';
import { base_url } from '../../config/config';
import roleService from '../../service/roleService';

const EditRole = () => {
    const navigate = useNavigate();
    const { store } = useContext(storeContext);
    const { id } = useParams();

    const [state, setState] = useState({
        title: '',
        description: ''
    });
    const [loader, setLoader] = useState(false);

    useEffect(() => {
        fetchRoleDetails();
    }, []);

    const fetchRoleDetails = async () => {
        try {
            const { data } = await roleService.fetchRoleDetail(id)
            const obj = data.metadata.metadata
            setState({
                title: obj.title || '',
                description: obj.description || ''
            });
        } catch (error) {
            toast.error('Failed to fetch role details');
        }
    };

    const inputHandler = (e) => {
        const { name, value } = e.target;
        setState((prevState) => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoader(true);

        try {
            const {data} = await roleService.editRole(id, state)
            toast.success(data.message);
            navigate('/admin/role');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update role');
        } finally {
            setLoader(false);
        }
    };

    return (
        <div className="bg-white rounded-md">
            <div className="flex justify-between p-4">
                <h2 className="text-xl font-medium">Edit Role</h2>
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
                            value={state.title}
                            onChange={inputHandler}
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
                            value={state.description}
                            onChange={inputHandler}
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
                        {loader ? 'Loading...' : 'Update Role'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EditRole;
