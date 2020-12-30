const jwt = require('jsonwebtoken')

module.exports = (req,res,next)=>{
    try {
        if(!req.headers.authorization) throw "Forbidden"

        // console.log(req.headers)
        const token = req.headers.authorization.split(" ")[1]
        // console.log(req)
        //Bearer asdasdasdasdasd
        const payload = jwt.verify(token,process.env.SECRET)
        req.payload = payload
        next()
    } catch (err) {
        res.status(401).json({
            message:"Forbidden"
        })
    }
    
}