const bcrypt = require('bcrypt')
const { User } = require('../../model')

exports.createUser = async (req, res) => {
    const { username, email, password } = req.body
    if (!username || !email || !password) {
        return res.status(400).send('All fields are required')
    }
    await User.create({
        username,
        email,
        password: await bcrypt.hash(password, 10)
    })
    res.status(201).send('User registered successfully')
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
    res.status(200).send('Login successful')
}

exports.renderRegisterForm = (req, res) => {
    res.render('register')
}


exports.renderLoginForm = (req, res) => {
    res.render('login')
}