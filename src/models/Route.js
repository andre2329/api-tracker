const mongoose = require("mongoose")

const routeSchema = mongoose.Schema({
    fecha:{type : String},
    idVendedor:{type: String, required: true},
    route:[{
        latitude: {type: Number, required: true},
        longitude: {type: Number, required: true},
        date:{type:Date,default: Date.now}
    }]
},{
    timestamps:true
}
)

module.exports = mongoose.model("Route", routeSchema)