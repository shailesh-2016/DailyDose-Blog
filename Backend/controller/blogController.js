const { Blog } = require("../models/blog");
const path = require("path");
const fs = require("fs");

exports.create = async (req, res) => {
  try {
    const { blog_title, blog_author, blog_desc } = req.body;
    const blog = await Blog.create({
      blog_title,
      blog_author,
      blog_desc,
      blog_image: req.file?.filename,
      user: req.user?.id,
    });
    if (blog) {
      res.json({
        success: true,
        message: "blog created succesfully",
      });
    } else {
      res.json({
        success: false,
        message: "something went wrong",
      });
    }
  } catch (error) {
    console.log("error: ", error);
  }
};

exports.getBlog = async (req, res) => {
  const blog = await Blog.find();
  if (blog) {
    res.json({
      success: true,
      blog,
    });
  }
};

exports.single = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findById(id); // ✅ Find by ID

    if (!blog) {
      return res
        .status(404)
        .json({ success: false, message: "Blog not found" });
    }

    res.status(200).json({ success: true, blog });
  } catch (error) {
    console.log("error: ", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// exports.trash = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const trash = await Blog.findByIdAndDelete(id);
//     if (trash) {
//       res.json({
//         success: true,
//         mesage: "blog deleted",
//       });
//     }
//   } catch (error) {
//     console.log("error: ", error);
//   }
// };

exports.trash = async (req, res) => {
  try {
    const { id } = req.params;

    const blog = await Blog.findById(id);

    if (!blog) {
      return res
        .status(404)
        .json({ success: false, message: "Blog not found" });
    }

    if (blog.user?.toString() !== req.user?.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this blog",
      });
    }

    const imgPath = path.join(__dirname, "../uploads", blog.blog_image);

    fs.unlink(imgPath, async (err) => {
      if (err) {
        return res.json({ success: false, message: "Image not found" });
      }

      await Blog.findByIdAndDelete(id);

      return res.json({ success: true, message: "Blog deleted successfully" });
    });
  } catch (error) {
    console.log("error: ", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const { blog_title, blog_author, blog_desc } = req.body;
    const blog = await Blog.findById(id);

    if (!blog) {
      return res
        .status(404)
        .json({ success: false, message: "Blog not found" });
    }

    if (blog.user?.toString() !== req.user?.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this blog",
      });
    }
    const updatedData = {
      blog_title,
      blog_author,
      blog_desc,
      blog_image: req.file?.filename,
    };
    await Blog.findByIdAndUpdate(id, updatedData);
    res.json({
      success: true,
      message: "updated",
    });
  } catch (error) {
    console.log("error: ", error);
  }
};

exports.getMyBlog = async (req, res) => {
  try {
    const userId = req.user?.id;
    const myBlog = await Blog.find({ user: userId });
    res.status(200).json({
      success: true,
      message: "all blog here...",
      myBlog,
    });
  } catch (error) {
    console.log("error: ", error);
  }
};
