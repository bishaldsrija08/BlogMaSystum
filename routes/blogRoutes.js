const { getAllBlogs, renderSingleBlog, renderCreateBlogForm, renderEditBlogForm, deleteBlog, updateBlog, createBlog, renderMyBlogs } = require('../controllers/blog/blogControllers');
const { isAuthenticated } = require('../middlewares/isAuthenticated');
const { multer, storage } = require('../middlewares/multer');
const upload = multer({storage:storage})

const router = require("express").Router()

router.route("/").get(getAllBlogs)
router.route("/single/:id").get(renderSingleBlog);
router.route("/blog").get(renderCreateBlogForm)
router.route("/edit/:id").get(renderEditBlogForm).post(isAuthenticated, updateBlog)

// ----------- PROBLEMS & FIXES -----------

// ❌ 1. First POST /create mistakenly calls the form renderer, not the creator
// ❌ 2. Two separate .route("/create") calls register *two* POST handlers;
//        the first one runs and ends the response, so createBlog never executes.
// ✅ Combine GET (show form) and POST (create blog) on the **same** route object.

router.route("/create")
      .get(renderCreateBlogForm)   // ✅ show “new blog” form
      .post(isAuthenticated, upload.single("image"), createBlog)            // ✅ actually create the blog

router.route("/delete/:id").get(isAuthenticated, deleteBlog)
router.route("/my-blogs").get(isAuthenticated,renderMyBlogs)

module.exports = router
