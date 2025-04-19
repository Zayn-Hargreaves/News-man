import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import storeContext from '../../../context/storeContext';
import toast from 'react-hot-toast';
import categoryService from '../../../service/categoryService';
import roleService from '../../../service/roleService';
import { flattenTree } from '../../../helper';
import accountService from '../../../service/accountService';

const CreateAccount = () => {
    const navigate = useNavigate();
    const { store } = useContext(storeContext);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [status, setStatus] = useState('active');
    const [avatar, setAvatar] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [roleId, setRoleId] = useState('');
    const [categories, setCategories] = useState([]);
    const [roles, setRoles] = useState([]);
    const [loader, setLoader] = useState(false);

    // Fetch categories and roles on mount
    useEffect(() => {
        fetchDropdownData();
    }, []);

    const fetchDropdownData = async () => {
        try {
            const [categoryRes, roleRes] = await Promise.all([
                categoryService.fetchParentCategory(),
                roleService.fetchRole(),
            ]); 
            const formattedCategories = flattenTree(categoryRes.data.metadata.metadata)
        
            setCategories(formattedCategories);
            setRoles(roleRes.data.metadata.metadata);
        } catch (error) {
            toast.error('Failed to fetch categories or roles');
        }
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAvatar(file);
            setAvatarPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoader(true);

        // 1. Upload avatar to Cloudinary
        let avatarUrl = '';
        if (avatar) {
            const formData = new FormData();
            formData.append('file', avatar);
            formData.append('upload_preset', 'ml_default');
            formData.append('cloud_name', 'dirb3hhg1');
            try {
                const response = await axios.post(
                    'https://api.cloudinary.com/v1_1/dirb3hhg1/image/upload',
                    formData
                );
                avatarUrl = response.data.secure_url;
            } catch (error) {
                toast.error('Failed to upload avatar');
            }
        }

        // 2. Create payload and send to backend
        const payload = {
            name,
            email,
            password,
            status,
            avatar: avatarUrl,
            CategoryId: categoryId,
            RoleId: roleId,
        };

        try {
            const result = await accountService.addAccount(payload)
            toast.success(result.data.message);
            navigate('/admin/account');  // Adjust the redirection URL as needed
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to create account');
        } finally {
            setLoader(false);
        }
    };

    return (
        <div className='bg-white rounded-md p-6'>
            <h2 className='text-xl font-medium mb-4'>Create Account</h2>

            <form onSubmit={handleSubmit} className='space-y-4'>
                <div>
                    <label htmlFor="name" className="text-md font-medium text-gray-600">Name</label>
                    <input
                        type='text'
                        id='name'
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className='w-full p-2 border rounded-md'
                        required
                    />
                </div>

                <div>
                    <label htmlFor="email" className="text-md font-medium text-gray-600">Email</label>
                    <input
                        type='email'
                        id='email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className='w-full p-2 border rounded-md'
                        required
                    />
                </div>

                <div>
                    <label htmlFor="password" className="text-md font-medium text-gray-600">Password</label>
                    <input
                        type='password'
                        id='password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className='w-full p-2 border rounded-md'
                        required
                    />
                </div>

                <div>
                    <label htmlFor="category" className="text-md font-medium text-gray-600">Category</label>
                    <select
                        id='category'
                        value={categoryId}
                        onChange={(e) => setCategoryId(e.target.value)}
                        className='w-full p-2 border rounded-md'
                        required
                    >
                        <option value=''>Select Category</option>
                        {categories.map((c) => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label htmlFor="role" className="text-md font-medium text-gray-600">Role</label>
                    <select
                        id='role'
                        value={roleId}
                        onChange={(e) => setRoleId(e.target.value)}
                        className='w-full p-2 border rounded-md'
                        required
                    >
                        <option value=''>Select Role</option>
                        {roles.map((r) => (
                            <option key={r.id} value={r.id}>{r.title}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label htmlFor="avatar" className="text-md font-medium text-gray-600">Avatar</label>
                    <div className='w-full h-40 flex items-center justify-center border-2 border-dashed mt-2 cursor-pointer'>
                        {avatarPreview ? (
                            <img src={avatarPreview} alt='Preview' className='h-full' />
                        ) : (
                            <div className='text-center'>Upload Avatar</div>
                        )}
                    </div>
                    <input
                        id="avatar"
                        type='file'
                        onChange={handleAvatarChange}
                        className='hidden'
                    />
                </div>

                <div>
                    <label htmlFor="status" className="text-md font-medium text-gray-600">Status</label>
                    <select
                        id="status"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className='w-full p-2 border rounded-md'
                        required
                    >
                        <option value='active'>Active</option>
                        <option value='inactive'>Inactive</option>
                    </select>
                </div>

                <div>
                    <button
                        type='submit'
                        disabled={loader}
                        className='w-full p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600'
                    >
                        {loader ? 'Saving...' : 'Create Account'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateAccount;
