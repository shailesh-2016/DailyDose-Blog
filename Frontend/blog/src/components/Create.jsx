import React from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const BlogForm = () => {
  const { register, handleSubmit, reset } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("blog_title", data.blog_title);
    formData.append("blog_author", data.blog_author);
    formData.append("blog_desc", data.blog_desc);
    formData.append("blog_image", data.blog_image[0]);

    try {
      const token = localStorage.getItem("token");

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/blog`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.status === 200) {
        toast.success("✅ Blog added successfully!");
        reset();
        navigate("/myBlog");
      } else {
        toast.error("❌ Something went wrong");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("🚫 Error submitting blog");
    }
  };

  return (
   <div className="max-w-xl mx-auto mt-8  p-6 bg-white dark:bg-gray-700 rounded-2xl shadow-lg">
  <h2 className="text-2xl font-bold mb-6 text-center dark:text-white">
    Create a Blog Post
  </h2>

  <form
    onSubmit={handleSubmit(onSubmit)}
    encType="multipart/form-data"
    className="space-y-4"
  >
    <div>
      <label className="block mb-1 text-gray-700 dark:text-gray-300 font-medium">
        Blog Title
      </label>
      <input
        type="text"
        {...register("blog_title", { required: true })}
        className="w-full border border-gray-300 dark:border-gray-600 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
        placeholder="Enter blog title"
      />
    </div>

    <div>
      <label className="block mb-1 text-gray-700 dark:text-gray-300 font-medium">
        Author
      </label>
      <input
        type="text"
        {...register("blog_author", { required: true })}
        className="w-full border border-gray-300 dark:border-gray-600 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
        placeholder="Enter author name"
      />
    </div>

    <div>
      <label className="block mb-1 text-gray-700 dark:text-gray-300 font-medium">
        Description
      </label>
      <textarea
        rows="5"
        {...register("blog_desc", { required: true })}
        className="w-full border border-gray-300 dark:border-gray-600 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
        placeholder="Enter blog description"
      ></textarea>
    </div>

    <div>
      <label className="block mb-1 text-gray-700 dark:text-gray-300 font-medium">
        Blog Image
      </label>
      <input
        type="file"
        accept="image/*"
        {...register("blog_image", { required: true })}
        className="w-full border border-gray-300 dark:border-gray-600 px-4 py-2 rounded-lg dark:bg-gray-800 dark:text-white"
      />
    </div>

    <button
      type="submit"
      className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
    >
      Submit Blog
    </button>
  </form>
</div>

  );
};

export default BlogForm;
