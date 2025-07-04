const { getAllBlogs, renderSingleBlog, renderCreateBlogForm, renderEditBlogForm, deleteBlog, updateBlog, createBlog } = require('../controllers/blog/blogControllers');
const { isAuthenticated } = require('../middlewares/isAuthenticated');

const router = require("express").Router()

router.route("/").get(getAllBlogs)
router.route("/single/:id").get(renderSingleBlog);
router.route("/blog").get(renderCreateBlogForm)
router.route("/edit/:id").get(renderEditBlogForm).post(updateBlog)

// ----------- PROBLEMS & FIXES -----------

// ❌ 1. First POST /create mistakenly calls the form renderer, not the creator
// ❌ 2. Two separate .route("/create") calls register *two* POST handlers;
//        the first one runs and ends the response, so createBlog never executes.
// ✅ Combine GET (show form) and POST (create blog) on the **same** route object.

router.route("/create")
      .get(isAuthenticated, renderCreateBlogForm)   // ✅ show “new blog” form
      .post(isAuthenticated, createBlog)            // ✅ actually create the blog

router.route("/delete/:id").get(deleteBlog)

module.exports = router
