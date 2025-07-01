const { createUser, loginUser, renderRegisterForm, renderLoginForm } = require("../controllers/auth/userControllers")

const router = require("express").Router()
router.route("/register").post(createUser).get(renderRegisterForm) // Register user
router.route("/login").post(loginUser).get(renderLoginForm) // Login user

module.exports = router 