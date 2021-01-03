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
    // console.log(req.body)
    // console.log(await User.find())
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

exports.getAllUsers = async(req,res)=>{
    // const {name,userName,password,isSupervisor}=req.body;
    // const emailRegex = /@gmail.com|@yahoo.com|@hotmail.com|@live.com/

    // if(!emailRegex.test(email)) throw "Email is not supported from your domain."
    // if(userName.lenght <4) throw "userNameLenght"
    // if(password.lenght <6) throw "passwordLenght"
    
    // const users = await User.find({isSupervisor:false})
    // console.log(req.headers)
    const users = await User.find({isSupervisor:false})
    if(!users) throw "EmptyUsers"
    else{
        res.json(users)
        
    }
}
exports.updateUser = async(req,res)=>{
    console.log(req.body)
    try {
        if(req.body.password){
            await User.findByIdAndUpdate({
                _id:req.body.idUser
            },
            {
                name:req.body.nombres,
                lastName:req.body.apellidos,
                password:sha256(req.body.password+process.env.SALT)
            }
            )
        }else{
            await User.findByIdAndUpdate({
                _id:req.body.idUser
            },
            {
                name:req.body.nombres,
                lastName:req.body.apellidos,
            }
            )
        }
        res.json({ message: 'success' })
        
    } catch (error) {
        res.status(400).json({
            message:'Error'
        })
        console.log(error)
    }
}
