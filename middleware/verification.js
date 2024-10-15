const jwt = require("jsonwebtoken")

function verifyAdmin(req, res, next) {
    let token = req.headers.authorization    
    jwt.verify(token, process.env.JWT_SECRET_KEY_ADMIN, (error) => {
        if (error)
            res.status(401).send({ result: "Fail", reason: "You Are Not An Authorized User to Access this API" })
        else
            next()
    })
}

function verifyBoth(req, res, next) {
    let token = req.headers.authorization    
    jwt.verify(token, process.env.JWT_SECRET_KEY_ADMIN, (error) => {
        if (error){
            jwt.verify(token, process.env.JWT_SECRET_KEY_BUYER, (error) => {
                if (error)
                    res.status(401).send({ result: "Fail", reason: "You Are Not An Authorized User to Access this API" })
                else
                    next()
            })
        }
        else
            next()
    })
}

module.exports = {
    verifyAdmin,
    verifyBoth
}