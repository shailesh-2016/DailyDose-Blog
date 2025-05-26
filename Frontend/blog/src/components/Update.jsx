import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const Update = () => {
  const { register, handleSubmit, reset } = useForm();
  const navigate = useNavigate();
  const { id } = useParams();

  async function show() {
    try {
      const res = await axios.get(`http://localhost:8000/api/blog/${id}`);
      // console.log("Fetched Blog: ", res.data.blog);

      reset(res.data.blog);
    } catch (error) {
      console.log("Error fetching data: ", error);
    }
  }

  useEffect(() => {
    show();
  }, []);

  async function updateData(data) {
    const formData = new FormData();
    formData.append("blog_title", data.blog_title);
    formData.append("blog_author", data.blog_author);
    formData.append("blog_desc", data.blog_desc);
    formData.append("blog_image", data.blog_image[0]);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        `http://localhost:8000/api/blog/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.status === 200) {
        toast.success("Blog updated successfully! ✨");
        navigate("/view");
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      if (error.response && error.response.status === 403) {
        toast.error("❌ You are not authorized to update this blog!");
      } else {
        toast.error("Failed to update blog ❌");
      }
      console.error("Delete Error: ", error);
    }
  }

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">Update Blog Post</h2>

      <form
        onSubmit={handleSubmit(updateData)}
        encType="multipart/form-data"
        className="space-y-4"
      >
        <div>
          <label className="block mb-1 text-gray-700 font-medium">
            Blog Title
          </label>
          <input
            type="text"
            {...register("blog_title", { required: true })}
            className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Enter blog title"
          />
        </div>

        <div>
          <label className="block mb-1 text-gray-700 font-medium">Author</label>
          <input
            type="text"
            {...register("blog_author", { required: true })}
            className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Enter author name"
          />
        </div>

        <div>
          <label className="block mb-1 text-gray-700 font-medium">
            Description
          </label>
          <textarea
            rows="5"
            {...register("blog_desc", { required: true })}
            className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Enter blog description"
          ></textarea>
        </div>

        {/* ✅ Image Upload Field */}
        <div>
          <label className="block mb-1 text-gray-700 font-medium">
            Upload Image
          </label>
          <input
            type="file"
            {...register("blog_image")}
            accept="image/*"
            className="w-full border border-gray-300 px-3 py-2 rounded-lg"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Update Blog
        </button>
      </form>
    </div>
  );
};

export default Update;
