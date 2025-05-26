import React, { useEffect, useState } from "react";
import axios from "axios";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/solid";
import { NavLink } from "react-router-dom";
import toast from "react-hot-toast";

const MyBlog = () => {
  const [Blog, setBlog] = useState([]);
  const [selectedBlog, setSelectedBlog] = useState(null);

  async function show() {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:8000/api/blog/myBlog", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setBlog(res.data.myBlog);
    } catch (error) {
      toast.error("Failed to load blogs ❌");
      console.log("error: ", error);
    }
  }

  useEffect(() => {
    show();
  }, []);

  async function trash(id) {
    try {
      const token = localStorage.getItem("token");

      await axios.delete(`http://localhost:8000/api/blog/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Blog deleted successfully! 🗑️");
      show();
    } catch (error) {
      if (error.response && error.response.status === 403) {
        toast.error("❌ You are not authorized to delete this blog!");
      } else {
        toast.error("Failed to delete blog ❌");
      }
      console.error("Delete Error: ", error);
    }
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-8">My Blog History</h1>

      {Blog?.length > 0 ? (
        <div className="flex justify-center">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Blog.map((item) => (
              <div
                key={item._id}
                className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition-all duration-300 w-[320px] h-[450px] flex flex-col"
              >
                {item.blog_image && (
                  <div className="w-full h-48 mb-3">
                    <img
                      src={`http://localhost:8000/image/${item.blog_image}`}
                      alt="blog"
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                )}

                <div className="flex justify-between items-start mb-2">
                  <h2 className="text-xl font-bold text-gray-800 line-clamp-1">
                    {item.blog_title}
                  </h2>
                  <div className="flex gap-2">
                    <NavLink to={`/update/${item._id}`}>
                      <PencilSquareIcon className="w-5 h-5 text-blue-500 hover:text-blue-700" />
                    </NavLink>
                    <button onClick={() => trash(item._id)}>
                      <TrashIcon className="w-5 h-5 text-red-500 hover:text-red-700" />
                    </button>
                  </div>
                </div>

                <p className="text-sm text-gray-500 mb-1">
                  By {item.blog_author}
                </p>
                <p className="text-gray-700 mb-4 line-clamp-3">
                  {item.blog_desc}
                </p>

                <div className="mt-auto">
                  <button
                    className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                    onClick={() => setSelectedBlog(item)}
                  >
                    Read More
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-500">No blogs found.</p>
      )}

      {/* Modal */}
      {selectedBlog && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setSelectedBlog(null)}
        >
          <div
            className="bg-white rounded-lg max-w-lg p-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold mb-4">
              {selectedBlog.blog_title}
            </h2>
            {selectedBlog.blog_image && (
              <img
                src={`http://localhost:8000/image/${selectedBlog.blog_image}`}
                alt="blog"
                className="w-full h-64 object-cover rounded-lg mb-4"
              />
            )}
            <p className="text-gray-700 mb-4">{selectedBlog.blog_desc}</p>
            <p className="text-sm text-gray-500 mb-4">
              By {selectedBlog.blog_author}
            </p>
            <button
              onClick={() => setSelectedBlog(null)}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyBlog;
