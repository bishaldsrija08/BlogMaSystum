const { getAllBlogs, renderSingleBlog, renderCreateBlogForm, renderEditBlogForm, deleteBlog } = require('../controllers/blog/blogControllers');

const router = require("express").Router()

router.route("/").get(getAllBlogs)
router.route("/single/:id").get(renderSingleBlog);
router.route("/blog").get(renderCreateBlogForm)
router.route("/edit/:id").get(renderEditBlogForm).post(renderEditBlogForm) // Assuming you want to handle the form submission here, adjust as necessary
router.route("/create").post(renderCreateBlogForm) // Assuming you want to create a blog
router.route("/delete/:id").get(deleteBlog)
router.route("/create").post(renderCreateBlogForm) // Assuming you want to create a blog here, adjust as necessary
module.exports = router 