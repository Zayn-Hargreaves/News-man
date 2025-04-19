import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import categoryService from "../../../service/categoryService";
import { flattenTree } from "../../../helper";

const EditCategory = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [state, setState] = useState({
    title: "",
    status: "",
    parentId: "",
  });

  const [categories, setCategories] = useState([]);
  const [loader, setLoader] = useState(false);

  // Hàm chuyển đổi cây danh mục thành danh sách phẳng có phân cấp
 

  useEffect(() => {
    // Lấy chi tiết danh mục
    const fetchCategoryDetail = async () => {
      try {
        const { data } = await categoryService.fetchCategoryDetail(id);
        setState({
          title: data.metadata.metadata.title,
          status: data.metadata.metadata.status,
          parentId: data.metadata.metadata.parentId || "",
        });
      } catch (error) {
        console.error("Error fetching category detail:", error);
      }
    };

    // Lấy danh sách danh mục cha
    const fetchCategories = async () => {
      try {
        const { data } = await categoryService.fetchParentCategory();
        if (data.metadata && data.metadata.metadata) {
          const formattedCategories = flattenTree(data.metadata.metadata);
          setCategories(formattedCategories);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategoryDetail();
    fetchCategories();
  }, [id]);

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
      await categoryService.editCategory(id, state);
      alert("Category updated successfully!");
      navigate("/admin/category");
    } catch (error) {
      alert(error.response?.data?.message || "Failed to update category.");
    } finally {
      setLoader(false);
    }
  };

  return (
    <div className="bg-white rounded-md shadow-md p-6">
      <h2 className="text-xl font-medium mb-4">Edit Category</h2>
      <form onSubmit={submit}>
        <div className="flex flex-col gap-4">
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

          <button
            type="submit"
            disabled={loader}
            className={`px-4 py-2 text-white rounded-md ${
              loader ? "bg-gray-300 cursor-not-allowed" : "bg-purple-500 hover:bg-purple-600"
            }`}
          >
            {loader ? "Loading..." : "Update Category"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditCategory;
