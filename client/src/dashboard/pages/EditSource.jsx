import React, { useContext, useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { base_url } from '../../config/config';
import axios from 'axios';
import storeContext from '../../context/storeContext';
import toast from 'react-hot-toast';
import sourceService from '../../service/sourceService';

const EditSource = () => {
  const { id } = useParams();
  const navigate = useNavigate();
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
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [loader, setLoader] = useState(false);

  const inputHandler = (e) => {
    const { name, value } = e.target;
    setState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const getSource = async () => {
    try {
      const {data } = await sourceService.fetchSourceDetail(id)
      // Xử lý data để chuyển selectors thành các thuộc tính
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
      });

      setAvatarPreview(firstMeta.avatar || null);


    } catch (error) {
    
      toast.error("Failed to fetch source data");
    }
  };

  const updateSource = async (e) => {
    e.preventDefault();
    setLoader(true);

    try {
      let avatarUrl = state.avatar;

      if (avatarFile) {
        const formData = new FormData();
        formData.append("file", avatarFile);
        formData.append("upload_preset", "ml_default");
        formData.append("cloud_name", "dirb3hhg1");

        const response = await fetch("https://api.cloudinary.com/v1_1/dirb3hhg1/image/upload", {
          method: "POST",
          body: formData,
        });
        const data = await response.json();
        avatarUrl = data.secure_url;
      }

      const payload = {
        ...state,
        avatar: avatarUrl,
      };
      const result = sourceService.editSource(id, payload)

      toast.success(result.data.message);
      navigate("/admin/source");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update source");
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    getSource();
  }, [id]);
  console.log(state)
  return (
    <div className="bg-white rounded-md">
      <div className="flex justify-between p-4">
        <h2 className="text-xl font-medium">Edit Source</h2>

      </div>
      <div className="p-4">
        <form onSubmit={updateSource}>
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div className="flex flex-col gap-2">
              <label htmlFor="name" className="text-md font-medium text-gray-600">
                Source Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Enter source name"
                value={state.name}
                onChange={inputHandler}
                required
                className="px-3 py-2 rounded-md border border-gray-300 focus:border-blue-500"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="status" className="text-md font-medium text-gray-600">
                Status
              </label>
              <select
                id="status"
                name="status"
                value={state.status}
                onChange={inputHandler}
                required
                className="px-3 py-2 rounded-md border border-gray-300 focus:border-blue-500"
              >
                <option value="">--- Select Status ---</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-2 mb-6">
            <label htmlFor="avatar" className="text-md font-medium text-gray-600">
              Avatar
            </label>
            <input
              type="file"
              id="avatar"
              accept="image/*"
              onChange={handleAvatarChange}
              className="border border-gray-300 rounded-md px-3 py-2 focus:border-blue-500"
            />
            {avatarPreview && (
              <div className="mt-4">
                <p className="text-sm text-gray-500 mb-2">Preview:</p>
                <img
                  src={avatarPreview}
                  alt="Avatar Preview"
                  className="w-32 h-32 object-cover rounded-md"
                />
              </div>
            )}
          </div>

          {/* Add other fields */}
          <div className="flex flex-col gap-2">
            <label htmlFor="link" className="text-md font-medium text-gray-600">
              Source Link
            </label>
            <input
              type="url"
              id="link"
              name="link"
              placeholder="Enter source URL"
              value={state.link}
              onChange={inputHandler}
              required
              className="px-3 py-2 rounded-md border border-gray-300 focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-6 mb-6">
            <div className="flex flex-col gap-2">
              <label className="text-md font-medium text-gray-600" htmlFor="tagArti">Tag Article</label>
              <input
                onChange={inputHandler}
                value={state.tagArti}
                type="text"
                name="tagArti"
                placeholder="Enter article tag"
                className="px-3 py-2 rounded-md border border-gray-300 focus:border-blue-500"
                id="tagArti"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-md font-medium text-gray-600" htmlFor="tagTitle">Tag Title</label>
              <input
                onChange={inputHandler}
                value={state.tagTitle}
                type="text"
                name="tagTitle"
                placeholder="Enter title tag"
                className="px-3 py-2 rounded-md border border-gray-300 focus:border-blue-500"
                id="tagTitle"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-6">
            <div className="flex flex-col gap-2">
              <label className="text-md font-medium text-gray-600" htmlFor="tagThumb">Tag Thumbnail</label>
              <input
                onChange={inputHandler}
                value={state.tagThumb}
                type="text"
                name="tagThumb"
                placeholder="Enter thumbnail tag"
                className="px-3 py-2 rounded-md border border-gray-300 focus:border-blue-500"
                id="tagThumb"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-md font-medium text-gray-600" htmlFor="tagDesc">Tag Description</label>
              <input
                onChange={inputHandler}
                value={state.tagDesc}
                type="text"
                name="tagDesc"
                placeholder="Enter description tag"
                className="px-3 py-2 rounded-md border border-gray-300 focus:border-blue-500"
                id="tagDesc"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-6">
            <div className="flex flex-col gap-2">
              <label className="text-md font-medium text-gray-600" htmlFor="tagRaw">Tag Raw Content</label>
              <input
                onChange={inputHandler}
                value={state.tagRaw}
                type="text"
                name="tagRaw"
                placeholder="Enter raw content tag"
                className="px-3 py-2 rounded-md border border-gray-300 focus:border-blue-500"
                id="tagRaw"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-md font-medium text-gray-600" htmlFor="tagCont">Tag Content</label>
              <input
                onChange={inputHandler}
                value={state.tagCont}
                type="text"
                name="tagCont"
                placeholder="Enter content tag"
                className="px-3 py-2 rounded-md border border-gray-300 focus:border-blue-500"
                id="tagCont"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-6">
            <div className="flex flex-col gap-2">
              <label className="text-md font-medium text-gray-600" htmlFor="tagCate">Tag Category</label>
              <input
                onChange={inputHandler}
                value={state.tagCate}
                type="text"
                name="tagCate"
                placeholder="Enter category tag"
                className="px-3 py-2 rounded-md border border-gray-300 focus:border-blue-500"
                id="tagCate"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-md font-medium text-gray-600" htmlFor="tagDele">Tag Deletion</label>
              <input
                onChange={inputHandler}
                value={state.tagDele}
                type="text"
                name="tagDele"
                placeholder="Enter deletion tag"
                className="px-3 py-2 rounded-md border border-gray-300 focus:border-blue-500"
                id="tagDele"
              />
            </div>
          </div>
          <button type="submit" disabled={loader} className='px-3 py-[6px] bg-purple-500 rounded-sm text-white hover:bg-purple-600'>
            {loader ? 'Updating...' : 'Update Source'}
          </button>
        </form>
      </div>
    </div>
  )
}
export default EditSource