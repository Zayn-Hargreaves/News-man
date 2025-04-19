import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import categoryService from "../../../service/categoryService"; // Import dịch vụ lấy danh mục cha từ backend.
import { flattenTree } from "../../../helper";

const CreateCategory = () => {
  const navigate = useNavigate();

  const [state, setState] = useState({
    title: "",
    status: "",
    parentId: "",
  });

  const [categories, setCategories] = useState([]);
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    // Lấy danh sách danh mục cha từ backend
    const fetchCategories = async () => {
      try {
        const { data } = await categoryService.fetchParentCategory(); // Sửa tên hàm tùy thuộc vào service bạn dùng
        const formattedCategories = flattenTree(data.metadata.metadata);
        console.log(formattedCategories)
        setCategories(formattedCategories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const inputHandler = (e) => {
    const { name, value } = e.target;
    setState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setLoader(true);

    try {
      // Gửi dữ liệu lên backend
      const { data } = await categoryService.createCategory(state); // Thay bằng API tạo danh mục của bạn
      alert(data.message || "Category created successfully!");
      navigate("/admin/category"); // Điều hướng về trang danh sách danh mục
    } catch (error) {
      alert(error.response?.data?.message || "Failed to create category.");
    } finally {
      setLoader(false);
    }
  };

  return (
    <div className="bg-white rounded-md shadow-md p-6">
      <h2 className="text-xl font-medium mb-4">Add New Category</h2>
      <form onSubmit={submit}>
        <div className="flex flex-col gap-4">
          {/* Tên danh mục */}
          <div className="flex flex-col gap-2">
            <label htmlFor="title" className="text-md font-medium text-gray-600">
              Category Name
            </label>
            <input
              type="text"
              id="title"
              name="title"
              placeholder="Enter category name"
              value={state.title}
              onChange={inputHandler}
              required
              className="px-3 py-2 rounded-md border border-gray-300 focus:border-blue-500"
            />
          </div>

          {/* Trạng thái */}
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

          {/* Danh mục cha */}
          <div className="flex flex-col gap-2">
            <label htmlFor="parentId" className="text-md font-medium text-gray-600">
              Parent Category
            </label>
            <select
              id="parentId"
              name="parentId"
              value={state.parentId}
              onChange={inputHandler}
              className="px-3 py-2 rounded-md border border-gray-300 focus:border-blue-500"
            >
              <option value="">--- No Parent ---</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.title}
                </option>
              ))}
            </select>
          </div>

          {/* Nút submit */}
          <button
            type="submit"
            disabled={loader}
            className={`px-4 py-2 text-white rounded-md ${
              loader ? "bg-gray-300 cursor-not-allowed" : "bg-purple-500 hover:bg-purple-600"
            }`}
          >
            {loader ? "Loading..." : "Create Category"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateCategory;
