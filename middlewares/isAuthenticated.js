const jwt = require('jsonwebtoken')
const { User } = require('../model')
const { promisify } = require('util')                       // ❌ was `require('util').promisify`

exports.isAuthenticated = async (req, res, next) => {
    const token = req.cookies.token
    // Check if token exists
    if (!token) {
        return res.status(401).json('Unauthorized, Token must send.');
    }

    // Verify token
    const decodedResult = await promisify(jwt.verify)(      // ❌ missing parentheses around promisified fn
        token,
        process.env.JWT_SECRET
    )

    // Check if user already exists
    const userExist = await User.findAll({ where: { id: decodedResult.id } })
    if (userExist.length === 0) {
        return res.status(401).json('Unauthorized, User not found.')
    }

    req.user = userExist[0]                                 // ❌ was entire array; assign the first (only) user
    next()
}