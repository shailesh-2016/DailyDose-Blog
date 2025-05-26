const { Schema, model } = require("mongoose");

const blogSchema = new Schema({
  blog_title: {
    type: String,
    required: true,
  },
  blog_author: {
    type: String,
    required: true,
  },
  blog_desc: {
    type: String,
    required: true,
  },
  blog_image: {
    type: String,
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

exports.Blog = model("Blog", blogSchema);
