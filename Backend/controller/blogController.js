// UPDATED blogController.js for Cloudinary
const { Blog } = require("../models/blog");

exports.create = async (req, res) => {
  try {
    const { blog_title, blog_author, blog_desc } = req.body;
    const blog = await Blog.create({
      blog_title,
      blog_author,
      blog_desc,
      blog_image: req.file?.path, // Cloudinary URL
      user: req.user?.id,
    });
    res.json({ success: true, message: "Blog created successfully" });
  } catch (error) {
    console.log("error: ", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.getBlog = async (req, res) => {
  const blog = await Blog.find();
  res.json({ success: true, blog });
};

exports.single = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findById(id);
    if (!blog)
      return res
        .status(404)
        .json({ success: false, message: "Blog not found" });
    res.status(200).json({ success: true, blog });
  } catch (error) {
    console.log("error: ", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.trash = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findById(id);
    if (!blog)
      return res
        .status(404)
        .json({ success: false, message: "Blog not found" });
    if (blog.user?.toString() !== req.user?.id)
      return res
        .status(403)
        .json({ success: false, message: "Not authorized" });
    await Blog.findByIdAndDelete(id);
    res.json({ success: true, message: "Blog deleted successfully" });
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
    if (!blog)
      return res
        .status(404)
        .json({ success: false, message: "Blog not found" });
    if (blog.user?.toString() !== req.user?.id)
      return res
        .status(403)
        .json({ success: false, message: "Not authorized" });

    const updatedData = {
      blog_title,
      blog_author,
      blog_desc,
    };

    if (req.file?.path) {
      updatedData.blog_image = req.file.path; // New Cloudinary URL
    }

    await Blog.findByIdAndUpdate(id, updatedData);
    res.json({ success: true, message: "Blog updated successfully" });
  } catch (error) {
    console.log("error: ", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.getMyBlog = async (req, res) => {
  try {
    const userId = req.user?.id;
    const myBlog = await Blog.find({ user: userId });
    res
      .status(200)
      .json({ success: true, message: "All blogs retrieved", myBlog });
  } catch (error) {
    console.log("error: ", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
