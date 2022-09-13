const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {

    // get Authentication header value
    const authzHeader = req.header('Authorization')
    if (!authzHeader) {
        return res.status(401).json({
        message: "Authentication details empty"
        })
    }

    // check for "Bearer " 
    if (authzHeader.slice(0, 7) !== 'Bearer ') {
        return res.status(401).json({
          message: "Invalid auth type"
        })
    }
    
    // get value after "Bearer ", the actual JWT token
    const token = authzHeader.slice(7)
    if (token.length === 0) {
        return res.status(401).json({
            message: "Invalid auth token"
        })
    }

    // set global var userAuth if JWT is valid
    const verified = jwt.verify(token, process.env.JWT_SECRET)
        
    if (verified) {
        res.locals.userAuth = verified
        next()
        return
    }

    return res.status(401).json({
        message: "Invalid auth token"
    })
}