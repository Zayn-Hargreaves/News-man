import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdCloudUpload } from 'react-icons/md';
import { Editor } from '@tinymce/tinymce-react';
import axios from 'axios';
import storeContext from '../../context/storeContext';
import toast from 'react-hot-toast';
import sourceService from '../../service/sourceService';
import categoryService from '../../service/categoryService';
import { flattenTree } from '../../helper';
import newsService from '../../service/newsService';

const CreateNews = () => {
    const navigate = useNavigate();
    const { store } = useContext(storeContext);
    const [title, setTitle] = useState('');
    const [source, setSource] = useState('');
    const [category, setCategory] = useState('');
    const [thumbnail, setThumbnail] = useState(null);
    const [thumbnailPreview, setThumbnailPreview] = useState('');
    const [description, setDescription] = useState('');
    const [content, setContent] = useState('');
    const [status, setStatus] = useState('active');
    const [sources, setSources] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loader, setLoader] = useState(false);

    useEffect(() => {
        fetchDropdownData();
    }, []);

    const fetchDropdownData = async () => {
        try {
            const [sourceRes, categoryRes] = await Promise.all([
                sourceService.fetchSource(),
                categoryService.fetchParentCategory(),
            ]);
            const formattedCategories = flattenTree(categoryRes)
            setSources(sourceRes);
            setCategories(formattedCategories);
        } catch (error) {
            toast.error('Failed to fetch dropdown data');
        }
    };

    const handleThumbnailChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setThumbnail(file);
            setThumbnailPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoader(true);

        // 1. Quét các ảnh base64 trong nội dung của TinyMCE
        const base64Images = content.match(/src="data:image\/(png|jpeg|jpg);base64,([A-Za-z0-9+/=]+)"/g);
        const imageUrls = {};

        // 2. Upload các ảnh base64 lên Cloudinary
        if (base64Images) {
            for (let img of base64Images) {
                const base64String = img.split('base64,')[1];
                const formData = new FormData();
                formData.append('file', base64String);
                formData.append('upload_preset', 'ml_default');
                formData.append('cloud_name', 'dirb3hhg1');

                try {
                    const response = await axios.post(
                        'https://api.cloudinary.com/v1_1/dirb3hhg1/image/upload',
                        formData
                    );
                    imageUrls[img] = response.data.secure_url;
                } catch (error) {
                    toast.error('Failed to upload images');
                }
            }
        }

        // 3. Thay thế các base64 trong content bằng URL từ Cloudinary
        let updatedContent = content;
        for (let [base64Img, url] of Object.entries(imageUrls)) {
            updatedContent = updatedContent.replace(base64Img, `src="${url}"`);
        }

        // 4. Upload thumbnail (nếu có)
        let thumbnailUrl = '';
        if (thumbnail) {
            const formData = new FormData();
            formData.append('file', thumbnail);
            formData.append('upload_preset', 'ml_default');
            formData.append('cloud_name', 'dirb3hhg1');
            try {
                const response = await axios.post(
                    'https://api.cloudinary.com/v1_1/dirb3hhg1/image/upload',
                    formData
                );
                thumbnailUrl = response.data.secure_url;
            } catch (error) {
                toast.error('Failed to upload thumbnail');
            }
        }

        // 5. Tạo payload và gửi dữ liệu lên backend
        const payload = {
            title,
            source,
            category,
            thumbnail: thumbnailUrl,
            description,
            content: updatedContent,  // Gửi nội dung đã thay thế base64
            status,
        };

        try {
            const result = await newsService.createNews(payload)
            toast.success(result.data.message);
            navigate('/admin/article');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to add news');
        } finally {
            setLoader(false);
        }
    };

    return (
        <div className='bg-white rounded-md p-6'>
            <h2 className='text-xl font-medium mb-4'>Create News</h2>

            <form onSubmit={handleSubmit} className='space-y-4'>
                <div>
                    <label htmlFor="title" className="text-md font-medium text-gray-600">Title</label>
                    <input
                        type='text'
                        id='title'
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className='w-full p-2 border rounded-md'
                        required
                    />
                </div>

                <div>
                    <label htmlFor="source" className="text-md font-medium text-gray-600">Source</label>
                    <select
                        id='source'
                        value={source}
                        onChange={(e) => setSource(e.target.value)}
                        className='w-full p-2 border rounded-md'
                        required
                    >
                        <option value=''>Select Source</option>
                        {sources.map((s) => (
                            <option key={s.id} value={s.id}>{s.name}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label htmlFor="category" className="text-md font-medium text-gray-600">Category</label>
                    <select
                        id='category'
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
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
                    <label htmlFor="thumbnail" className="text-md font-medium text-gray-600">
                        Thumbnail
                    </label>
                    <div className='w-full h-40 flex items-center justify-center border-2 border-dashed mt-2 cursor-pointer'>
                        {thumbnailPreview ? (
                            <img src={thumbnailPreview} alt='Preview' className='h-full' />
                        ) : (
                            <MdCloudUpload size={50} />
                        )}
                    </div>
                    <input
                        id="thumbnail"
                        type='file'
                        onChange={handleThumbnailChange}
                        className='hidden'
                    />
                </div>

                <div>
                    <label htmlFor="description" className="text-md font-medium text-gray-600">Description</label>
                    <textarea
                        id="description"
                        placeholder='Description'
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className='w-full p-2 border rounded-md'
                        required
                    ></textarea>
                </div>
                <div>
                    <label htmlFor="content" className="text-md font-medium text-gray-600">Content</label>
                    <Editor
                        apiKey="jfcthyl2ncvyoq28t8n5kb351yddrgyxuwmpazoowf83ry1x"
                        value={content}
                        init={{
                            height: 400,
                            menubar: true,
                            plugins: 'image link code table',
                            toolbar: 'undo redo | bold italic | alignleft aligncenter alignright | image link code',
                            automatic_uploads: false,  // Tắt upload tự động lên server
                            images_upload_url: 'data:image',
                        }}
                        onEditorChange={(newValue) => setContent(newValue)}
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
                        {loader ? 'Saving...' : 'Create News'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateNews;
