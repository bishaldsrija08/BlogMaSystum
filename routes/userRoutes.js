const { createUser, loginUser, renderRegisterForm, renderLoginForm, logOUt, forgotPasssword, checkForgotPasssword } = require("../controllers/auth/userControllers")

const router = require("express").Router()
router.route("/register").post(createUser).get(renderRegisterForm) // Register user
router.route("/login").post(loginUser).get(renderLoginForm) // Login user
router.route("/logout").get(logOUt) // Logout user


router.route("/forgot-password").get(forgotPasssword).post(checkForgotPasssword)
module.exports = router 