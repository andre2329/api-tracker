const mongoose = require("mongoose")
const Route = mongoose.model("Route")
const sha256 = require('js-sha256')
const jwt = require('jsonwebtoken')


exports.getRoutesById = async(req,res)=>{
    // console.log(req.body)
    // console.log(req)
    const {userid}=req.headers;
    try{
        const rutas = await Route.find({idVendedor:userid}).sort({"createdAt": -1})
        console.log(rutas)
        if(!rutas) throw "EmptyRoutes"
        else{
            let respuesta = {
                rutas,
                message:'success'
            }
            res.json(respuesta)
        }

    }catch(e){
        console.log(e)
    }
}
