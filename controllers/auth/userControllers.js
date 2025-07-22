const bcrypt = require('bcrypt')
const { User } = require('../../model')
const jwt = require('jsonwebtoken')
const { sendMail } = require('../../config/sendMail.js')

exports.createUser = async (req, res) => {
    const { username, email, password, confirmPassword } = req.body
    if (!username || !email || !password || !confirmPassword) {
        return res.status(400).send('All fields are required')
    }
    if (password.toLowerCase() !== confirmPassword.toLowerCase()) {
        req.flash("error", "Passwords do not match")
        res.redirect('/register')
    }
    if (password.length < 10) {
        req.flash("error", "Password must be at least 6 characters long")
        res.redirect('/register')
    }
    if (password.trim() === "" || confirmPassword.trim() === "") {
        req.flash("error", "Password cannot be empty")
        res.redirect('/register')
    }
    await User.create({
        username,
        email,
        password: await bcrypt.hash(password, 10)
    })
    res.redirect('/login')
}

exports.loginUser = async (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
        return res.status(400).send('All fields are required')
    }

    const isUser = await User.findOne({ where: { email } })

    if (!isUser) {
        req.flash("error", "User not found.")
        res.redirect('/login')
    }

    const isMatch = await bcrypt.compare(password, isUser.password)
    if (!isMatch) {
        req.flash("error", "Invalid Crendentials")
        res.redirect('/login')
    }
    // Here you can generate a JWT token and send it back to the client
    const token = jwt.sign({ id: isUser.id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || "30d"
    });
    res.cookie('token', token)
    req.flash("success", "Login success")
    res.redirect('/')
}

exports.renderRegisterForm = (req, res) => {
    const error = req.flash("error")
    res.render('register', { error })
}


exports.renderLoginForm = (req, res) => {
    const error = req.flash("error")
    res.render('login', { error })
}

exports.logOUt = (req, res) => {
    res.clearCookie('token')
    res.redirect('/login')
}

exports.forgotPasssword = (req, res) => {
    res.render("forgotPassword")
}

exports.checkForgotPasssword = async (req, res) => {
    const { email } = req.body
    if (!email) {
        return res.status(400).send("Email is mandetory.")
    }
    const emailExists = await User.findAll({
        where: {
            email: email
        }
    })
    if (emailExists.length === 0) {
        return res.redirect("/register")
    } else {
        const otp = Math.floor(10000 + Math.random() * 90000)
        sendMail(email, otp)

        //Otp rw otp generate vako time save gareko!
        emailExists[0].otp = otp
        emailExists[0].otpGeneratedTime = Date.now()
        await emailExists[0].save()

        res.redirect('/otp/?email=' + email)
    }
}

exports.renderOtpForm = (req, res) => {
    const email = req.query.email
    const error = req.flash("error")
    res.render('otp', { email, error })
}


exports.handleOtp = async (req, res) => {
    const { otp } = req.body
    const { email } = req.params
    if (!otp || !email) {
        res.send("Must provide otp and email.")
    }
    const userData = await User.findAll({
        where: {
            email: email,
            otp: otp
        }
    })
    if (userData.length === 0) {
        req.flash("error", "Invalid Otp.")
        res.redirect('/otp/?email=' + email)
    } else {
        const currentTime = Date.now()
        const otpGeneratedTime = userData[0].otpGeneratedTime
        if (currentTime - otpGeneratedTime <= 120000) {
            res.redirect(`/password-change/?email=${email}&&otp=${otp}`)
            // userData[0].otpGeneratedTime = null
            // userData[0].otp = null
            // await userData[0].save()

        } else {
            userData[0].otpGeneratedTime = null
            userData[0].otp = null
            await userData[0].save()
            req.flash("error", "OTP expired")
            res.redirect('/otp')
        }

    }

}

exports.renderPwChangeForm = (req, res) => {
    const error = req.flash("error")
    const { email, otp } = req.query
    res.render("changePw", { email, otp, error })
}

exports.handlePwChange = async (req, res) => {
    const { email, otp } = req.params
    const { password, confirmPassword } = req.body
    if (!password || !confirmPassword || !email || !otp) {
        return res.send("Please provide all info.")
    }
    if (password !== confirmPassword) {
        req.flash("error", "Password and confirm password must be equal.")
        res.redirect(`/password-change/?email=${email}&&otp=${otp}`)
    }
    const doesUserExists = await User.findAll({
        where: {
            email,
            otp
        }
    })
    if (doesUserExists.length === 0) {
        req.flash("error", "User is not register")
        res.redirect(`/password-change/?email=${email}&&otp=${otp}`)
    }
    const currentTime = Date.now()
    const otpGeneratedTime = doesUserExists[0].otpGeneratedTime
    if (currentTime - otpGeneratedTime >= 120000) {
        return res.redirect("/forgot-password")
    }
    doesUserExists[0].password = bcrypt.hashSync(password, 10)
    doesUserExists[0].otpGeneratedTime = null
    doesUserExists[0].otp = null
    await doesUserExists[0].save()
    res.redirect("/login")
}