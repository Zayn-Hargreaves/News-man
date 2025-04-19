import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import sourceService from "../../service/sourceService";

const AddSource = () => {
  const navigate = useNavigate();

  const [state, setState] = useState({
    name: "",
    status: "",
    link: "",
    tagArti: "",
    tagThumb: "",
    tagTitle: "",
    tagDesc: "",
    tagRaw:"",
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
      setAvatarFile(file); // Lưu file để upload khi submit
      setAvatarPreview(URL.createObjectURL(file)); // Để tạo preview
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    setLoader(true);

    try {
      let avatarUrl = "";

      if (avatarFile) {
        // Upload ảnh lên Cloudinary
        const formData = new FormData();
        formData.append("file", avatarFile);
        formData.append("upload_preset", "ml_default"); // Thay bằng upload preset của bạn
        formData.append("cloud_name", "dirb3hhg1"); // Thay bằng cloud name của bạn

        try {
          const response = await fetch("https://api.cloudinary.com/v1_1/dirb3hhg1/image/upload", {
            method: "POST",
            body: formData,
          });

          const data = await response.json();

          avatarUrl = data.secure_url; // Lấy link ảnh sau khi upload
        } catch (error) {
          console.log(error);
        }
      }

      const payload = {
        ...state,
        avatar: avatarUrl, // Gán link ảnh vào payload
      };

      // Gửi dữ liệu lên backend
      const result = await sourceService.addSource(payload);
      console.log(result)
      toast.success(result.data.message);
      navigate("/admin/source");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add source");
    } finally {
      setLoader(false);
    }
  };

  return (
    <div className="bg-white rounded-md shadow-md">
      <div className="flex justify-between p-4 border-b">
        <h2 className="text-xl font-medium">Add New Source</h2>
      </div>
      <div className="p-4">
        <form onSubmit={submit}>
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
              <label className="text-md font-medium text-gray-600" htmlFor="tagThumb">Tag Article</label>
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
              <label className="text-md font-medium text-gray-600" htmlFor="tagDesc">Tag Raw Content</label>
              <input
                onChange={inputHandler}
                value={state.tagRaw}
                type="text"
                name="tagRaw"
                placeholder="Enter description tag"
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
          <button
            type="submit"
            disabled={loader}
            className={`px-4 py-2 text-white rounded-md ${loader ? "bg-gray-300 cursor-not-allowed" : "bg-purple-500 hover:bg-purple-600"
              }`}
          >
            {loader ? "Loading..." : "Add Source"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddSource;
