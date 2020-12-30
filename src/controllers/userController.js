const mongoose = require("mongoose")
const User = mongoose.model("User")
const sha256 = require('js-sha256')
const jwt = require('jsonwebtoken')


exports.register = async(req,res)=>{
    const {name,userName,password,isSupervisor}=req.body;
    // const emailRegex = /@gmail.com|@yahoo.com|@hotmail.com|@live.com/

    // if(!emailRegex.test(email)) throw "Email is not supported from your domain."
    if(userName.lenght <4) throw "userNameLenght"
    if(password.lenght <6) throw "passwordLenght"

    const userExist = await User.findOne({
        userName,
    })
    if(userExist) throw "userNameExists"
    else{
        const user = new User({name,userName,password:sha256(password+process.env.SALT),isSupervisor})
        await user.save();
        res.json({message:"userCreated"})
    }
}
exports.login = async(req,res)=>{
    const {userName,password} = req.body
    const user = await User.findOne({
        userName:userName,
        password:sha256(password+process.env.SALT),
    })
    // console.log(req.body)
    // console.log(email)
    // res.json({usuario:userName,password:password,valor:'1',req:req})
    if(!user) throw "invalidUserName"
    const token = await jwt.sign({id:user.id},process.env.SECRET)
    res.json({
        message:"success",
        token,
        isSupervisor:user.isSupervisor,
        id:user.id
    })

}