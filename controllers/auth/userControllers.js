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
        return res.status(400).send('Passwords do not match')
    }
    if (password.length < 10) {
        return res.status(400).send('Password must be at least 6 characters long')
    }
    if (password.trim() === "" || confirmPassword.trim() === "") {
        return res.status(400).send('Password cannot be empty')
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
        return res.status(404).send('User not found')
    }

    const isMatch = await bcrypt.compare(password, isUser.password)
    if (!isMatch) {
        return res.status(401).send('Invalid credentials')
    }
    // Here you can generate a JWT token and send it back to the client
    const token = jwt.sign({ id: isUser.id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || "30d"
    });
    res.cookie('token', token)
    res.redirect('/')
}

exports.renderRegisterForm = (req, res) => {
    res.render('register')
}


exports.renderLoginForm = (req, res) => {
    res.render('login')
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
        console.log(otp)
        sendMail(email, otp)
        res.send("OTP sent!")
    }


}