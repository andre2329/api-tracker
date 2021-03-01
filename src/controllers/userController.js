const mongoose = require("mongoose")
const User = mongoose.model("User")
const sha256 = require('js-sha256')
const jwt = require('jsonwebtoken')

exports.register = async(req,res)=>{
    // console.log(req.body)
    const {name,userName,password,lastName}=req.body;
    // const emailRegex = /@gmail.com|@yahoo.com|@hotmail.com|@live.com/

    // if(!emailRegex.test(email)) throw "Email is not supported from your domain."
    // console.log(userName.lenght())
    // console.log(password.lenght())
    // console.log(typeof(userName))
    // console.log(typeof(password))
    
    if(userName.length <4) throw "userNameLenght"
    if(password.length <6) throw "passwordLenght"

    const userExist = await User.findOne({
        userName,
    })
    if(userExist) throw "userNameExists"
    else{
        const user = new User({name,userName,password:sha256(password+process.env.SALT),isSupervisor:false,lastName})
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
exports.verifyLogin = async(req,res)=>{
    const {id} = req.body
    const user = await User.findById({
        _id:id})
    if(!user) throw "invalidUserName"
    const token = await jwt.sign({id:user.id},process.env.SECRET)
    res.json(
    {
        message:"success"
    }
    )

}

exports.getAllUsers = async(req,res)=>{
    const users = await User.find({isSupervisor:false})
    .select('name lastName _id userName isSupervisor')
    if(!users) throw "EmptyUsers"
    else{
        let respuesta = {
            users,
            message:'success'
        }
        res.json(respuesta)
        
    }
}
exports.getRoutesById = async(req,res)=>{
    const users = await User.find({isSupervisor:false})
    .select('name lastName _id userName isSupervisor')
    if(!users) throw "EmptyUsers"
    else{
        let respuesta = {
            users,
            message:'success'
        }
        res.json(respuesta)
        
    }

    try {
        let id = req.headers.userid
        let recorrido = await User.findById(id).select('recorrido')
        res.json({recorrido})
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message:"Error"
        })
    }
}

exports.updateUser = async(req,res)=>{
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
