const bcrypt = require('bcrypt')
const { User } = require('../../model')

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
    res.redirect('/')
}

exports.renderRegisterForm = (req, res) => {
    res.render('register')
}


exports.renderLoginForm = (req, res) => {
    res.render('login')
}