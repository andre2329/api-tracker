const mongoose = require("mongoose")
const User = mongoose.model("User")
const sha256 = require('js-sha256')
const jwt = require('jsonwebtoken')

exports.register = async (req, res) => {
    // console.log(req.body)
    const { name, userName, password, lastName,rol } = req.body;
    const {id} = req.headers
    // const emailRegex = /@gmail.com|@yahoo.com|@hotmail.com|@live.com/

    // if(!emailRegex.test(email)) throw "Email is not supported from your domain."
    // console.log(userName.lenght())
    // console.log(password.lenght())
    // console.log(typeof(userName))
    // console.log(typeof(password))
    if (userName && password) {
        if (userName.length < 4) throw "userNameLenght"
        if (password.length < 6) throw "passwordLenght"
        let isSupervisor = false
        let isAdmin = false

        if(id){
            const userAdmin = await User.findById({
                _id: id
            })
            if(userAdmin.isAdmin){
                switch (rol) {
                    case 'supervisor':
                        isSupervisor = true
                        break;
                    default:
                        break;
                }
            }
            if(!userAdmin.isSupervisor){
                throw "unauthorized"
            }
        }
        
        const userExist = await User.findOne({
            userName,
        })

        if (userExist) throw "userNameExists"
        else {
            const user = new User({ name, userName, password: sha256(password + process.env.SALT), isSupervisor, lastName, isAdmin })
            await user.save();
            res.json({ message: "userCreated" })
        }
    } else {
        throw "invalidParameters"
    }
}

exports.login = async (req, res) => {
    const { userName, password } = req.body
    const user = await User.findOne({
        userName: userName,
        password: sha256(password + process.env.SALT),
    })
    if (!user) throw "invalidUserName"
    const token = await jwt.sign({ id: user.id }, process.env.SECRET)
    res.json({
        message: "success",
        token,
        isSupervisor: user.isSupervisor,
        id: user.id
    })

}
exports.verifyLogin = async (req, res) => {
    const { id } = req.body
    const user = await User.findById({
        _id: id
    })
    if (!user) throw "invalidUserName"
    const token = await jwt.sign({ id: user.id }, process.env.SECRET)
    res.json(
        {
            message: "success"
        }
    )

}

exports.getAllUsers = async (req, res) => {
    // console.log(req.headers)
    let option = {isSupervisor:false}
    const {id} = req.headers

    if(id){
            const userAdmin = await User.findById({
                _id: id
            })
            if(userAdmin.isAdmin){
                option={}
            }
            if(!userAdmin.isSupervisor){
                throw "unauthorized"
            }
    }

    const users = await User.find(option)
        .select('name lastName _id userName isSupervisor')
    if (!users) throw "EmptyUsers"
    else {
        let respuesta = {
            users,
            message: 'success'
        }
        res.json(respuesta)

    }
}
exports.getRoutesById = async (req, res) => {
    const users = await User.find({ isSupervisor: false })
        .select('name lastName _id userName isSupervisor')
    if (!users) throw "EmptyUsers"
    else {
        let respuesta = {
            users,
            message: 'success'
        }
        res.json(respuesta)

    }

    try {
        let id = req.headers.userid
        let recorrido = await User.findById(id).select('recorrido')
        res.json({ recorrido })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "Error"
        })
    }
}

exports.updateUser = async (req, res) => {
    try {
        const {id} = req.headers
        let isAdmin = false
        if(id){
                const userAdmin = await User.findById({
                    _id: id
                })
                if(userAdmin.isAdmin){
                    isAdmin = true
                }
                if(!userAdmin.isSupervisor){
                    throw "unauthorized"
                }
        }
        let pass = req.body.password
        let name = req.body.nombres
        let lastName = req.body.apellidos
        let password = sha256(req.body.password + process.env.SALT)
        let isSupervisor = (req.body.rol=="supervisor")?true:false
        let options = {}

        if(pass !="" && pass){
            if(isAdmin){
                options = {name,lastName,password,isSupervisor}
            }else{
                options = {name,lastName,password}
            }
        }else{
            if(isAdmin){
                options = {name,lastName,isSupervisor}
            }else{
                options = {name,lastName}
            }
        }

        await User.findByIdAndUpdate({
            _id: req.body.idUser
        },
            options
        ,{useFindAndModify:false})
        res.json({ message: 'success' })

    } catch (error) {
        res.status(400).json({
            message: 'Error'
        })
        console.log(error)
    }
}
exports.deleteUser = async (req, res) => {

    const {id} = req.headers
    const {idUser} = req.body
    let isAdmin = false
    try{
        if(id){
            const userAdmin = await User.findById({
                _id: id
            })
            if(userAdmin.isAdmin){
                isAdmin = true
            }
            if(!userAdmin.isSupervisor){
                throw "unauthorized"
            }

            if(isAdmin){
                const deleteUser = await User.findById({
                    _id:idUser
                })
                if(deleteUser){
                    await User.findByIdAndDelete({
                        _id:idUser
                    })
                    res.json({ message: 'success' })
                }else{
                    throw "userUnknow"
                }
            }else{
                const deleteUser = await User.findById({
                    _id:idUser
                })
                if(deleteUser){
                    if(!deleteUser.isSupervisor){
                        await User.findByIdAndDelete({
                            _id:idUser
                        })
                        res.json({ message: 'success' })
                    }else{
                        throw "unauthorized"
                    }
                    
                }else{
                    throw "userUnknow"
                }
            }
            

    }else{
        throw "unauthorized"
    }
    }catch(error){
        throw "InternalError"
    }
    
}
