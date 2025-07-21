
const { decodeToken } = require('../config/decodeToken')
const { User } = require('../model')


exports.isAuthenticated = async (req, res, next) => {
    const token = req.cookies.token
    // Check if token exists
    if (!token) {
        return res.redirect('/login')          // ❌ was `res.status(401).json('Unauthorized, No token found.')`
    }

    // Verify token
    const decodedResult = await decodeToken(token, process.env.JWT_SECRET)

    // Check if user already exists
    const userExist = await User.findAll({ where: { id: decodedResult.id } })
    if (userExist.length === 0) {
        return res.status(401).json('Unauthorized, User not found.')
    }

    req.user = userExist[0]                                 // ❌ was entire array; assign the first (only) user
    next()
}