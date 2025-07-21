const { createUser, loginUser, renderRegisterForm, renderLoginForm, logOUt, forgotPasssword, checkForgotPasssword, renderOtpForm, handleOtp, handlePwChange, renderPwChangeForm } = require("../controllers/auth/userControllers")

const router = require("express").Router()
router.route("/register").post(createUser).get(renderRegisterForm) // Register user
router.route("/login").post(loginUser).get(renderLoginForm) // Login user
router.route("/logout").get(logOUt) // Logout user


router.route("/forgot-password").get(forgotPasssword).post(checkForgotPasssword)
router.route('/otp').get(renderOtpForm)
router.route('/otp/:email').post(handleOtp)

router.route('/password-change').get(renderPwChangeForm)
router.route("/password-change/:email").post(handlePwChange)
module.exports = router 