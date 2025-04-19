import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { base_url } from '../../config/config';
import axios from 'axios';
import storeContext from '../../context/storeContext';
import toast from 'react-hot-toast';
import sourceService from '../../service/sourceService';

const SourceDetail = () => {
    const { id } = useParams();
    const { store } = useContext(storeContext);
    const [state, setState] = useState({
        name: "",
        status: "",
        link: "",
        tagArti: "",
        tagThumb: "",
        tagTitle: "",
        tagDesc: "",
        tagRaw: "",
        tagCont: "",
        tagCate: "",
        tagDele: "",
        avatar: ""
    });

    const getSource = async () => {
        try {
            const {data} = await sourceService.fetchSourceDetail(id)
            const metadata = data.metadata.metadata || [];
            const tagData = metadata.reduce((acc, item) => {
                if (item["selectors.selector"] && item["selectors.value"]) {
                    acc[item["selectors.selector"]] = item["selectors.value"];
                }
                return acc;
            }, {});

            const firstMeta = metadata[0] || {};

            setState({
                name: firstMeta.name || "",
                status: firstMeta.status || "",
                link: firstMeta.link || "",
                tagArti: tagData["tagArti"] || "",
                tagThumb: tagData["tagThumb"] || "",
                tagTitle: tagData["tagTitle"] || "",
                tagDesc: tagData["tagDesc"] || "",
                tagRaw: tagData["tagRaw"] || "",
                tagCont: tagData["tagCont"] || "",
                tagCate: tagData["tagCate"] || "",
                tagDele: tagData["tagDele"] || "",
                avatar: firstMeta.avatar || "",
            });
        } catch (error) {
            console.error(error);
            toast.error("Failed to fetch source data");
        }
    };

    useEffect(() => {
        getSource();
    }, [id]);

    return (
        <div className="bg-white p-6 rounded-md shadow-lg max-w-full">
            <h2 className="text-2xl font-semibold mb-6 text-center">Source Details</h2>

            {/* Source Name */}
            <div className="flex items-center p-4 border rounded-md mb-4">
                <span className="font-medium">Source Name:</span>
                <span className="ml-4">{state.name}</span>
            </div>

            {/* Status */}
            <div className="flex items-center p-4 border rounded-md mb-4">
                <span className="font-medium mr-4">Status:</span>
                <span
                    className={`px-3 py-1 rounded-full text-white ${state.status === 'active' ? 'bg-green-500' : 'bg-red-500'}`}
                >
                    {state.status}
                </span>
            </div>


            {/* Avatar */}
            <div className="mb-6 p-4 border rounded-lg">
                <div className="font-medium text-gray-700">Avatar:</div>
                <div className="text-gray-600">
                    {state.avatar ? (
                        <img src={state.avatar} alt="Avatar" className="w-full h-64 object-cover rounded-md" />
                    ) : (
                        <p>No avatar available</p>
                    )}
                </div>
            </div>

            {/* Source Link */}
            <div className="flex items-center p-4 border rounded-md mb-4">
                <span className="font-medium">Source Link:</span>
                <span className="ml-4">{state.link}</span>
            </div>

            {/* Tags */}
            <div className="mb-6 p-4 border rounded-lg">
                <div className="font-medium text-gray-700">Tags:</div>
                <ul className="list-disc pl-6 text-gray-600">
                    <li>Tag Article:  {state.tagArti || 'N/A'}</li>
                    <li>Tag Title:  {state.tagTitle || 'N/A'}</li>
                    <li>Tag Thumbnail:  {state.tagThumb || 'N/A'}</li>
                    <li>Tag Description:  {state.tagDesc || 'N/A'}</li>
                    <li>Tag Raw Content:  {state.tagRaw || 'N/A'}</li>
                    <li>Tag Content:  {state.tagCont || 'N/A'}</li>
                    <li>Tag Category:  {state.tagCate || 'N/A'}</li>
                    <li>Tag Deletion:  {state.tagDele || 'N/A'}</li>
                </ul>
            </div>
        </div>
    );
};

export default SourceDetail;
