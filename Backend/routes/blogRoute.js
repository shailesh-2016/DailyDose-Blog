const blogController = require("../controller/blogController");
const upload = require("../middleware/uploads");
const router = require("express").Router();
const { verifyToken } = require("../middleware/authMiddleware");

router.post(
  "/",
  upload.single("blog_image"),
  verifyToken,
  blogController.create
);
router.get("/getBlog", blogController.getBlog);
router.get("/myBlog", verifyToken, blogController.getMyBlog);
router.get("/:id", blogController.single);
router.delete("/:id", verifyToken, blogController.trash);
router.put(
  "/:id",
  upload.single("blog_image"),
  verifyToken,
  blogController.updateBlog
);

module.exports = router;
