const jwt = require('jsonwebtoken')
const { promisify } = require('util')                       // ❌ was `require('util').promisify`
exports.decodeToken = async (token, secret) => {
   return await promisify(jwt.verify)(      // ❌ missing parentheses around promisified fn
        token,
        secret
    )
}