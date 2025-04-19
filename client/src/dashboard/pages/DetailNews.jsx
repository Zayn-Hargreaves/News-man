import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import storeContext from '../../context/storeContext';
import toast from 'react-hot-toast';
import newsService from '../../service/newsService';

const NewsDetail = () => {
    const { id } = useParams();
    const { store } = useContext(storeContext);
    const [state, setState] = useState({
        title: '',
        thumbnail: '',
        sourceName: '',
        categoryName: '',
        description: '',
        content: '',
        status: ''
    });

    useEffect(() => {
        fetchNewsDetail();
    }, [id]);

    const fetchNewsDetail = async () => {
        try {
            const { data } = newsService.fetchNewsDetail(id);
            setState({
                title: data.title,
                sourceName: data.source?.name || 'N/A',
                categoryName: data.category?.name || 'N/A',
                description: data.description,
                content: data.content,
                status: data.status,
                thumbnail: data.thumbnail
            });
        } catch (error) {
            toast.error('Failed to fetch news details');
        }
    };

    return (
        <div className='bg-white p-6 rounded-md shadow-lg max-w-3xl mx-auto'>
            <h2 className='text-3xl font-semibold mb-4 text-center'>{state.title}</h2>
            
            {state.thumbnail && (
                <div className='mb-6'>
                    <img src={state.thumbnail} alt='Thumbnail' className='w-full h-80 object-cover rounded-md' />
                </div>
            )}
            
            <div className='mb-4'>
                <span className='font-medium text-gray-700'>Source:</span>
                <span className='ml-2 text-gray-600'>{state.sourceName}</span>
            </div>
            
            <div className='mb-4'>
                <span className='font-medium text-gray-700'>Category:</span>
                <span className='ml-2 text-gray-600'>{state.categoryName}</span>
            </div>

            <div className='mb-4'>
                <span className='font-medium text-gray-700'>Status:</span>
                <span className={`ml-2 px-3 py-1 rounded-full text-white ${state.status === 'active' ? 'bg-green-500' : 'bg-red-500'}`}>{state.status}</span>
            </div>

            <div className='mb-6'>
                <h3 className='font-medium text-gray-700 mb-2'>Description:</h3>
                <p className='text-gray-600'>{state.description}</p>
            </div>

            <div>
                <h3 className='font-medium text-gray-700 mb-2'>Content:</h3>
                <div className='text-gray-600' dangerouslySetInnerHTML={{ __html: state.content }}></div>
            </div>
        </div>
    );
};

export default NewsDetail;
