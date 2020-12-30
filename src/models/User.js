const mongoose = require("mongoose")

const userSchema = mongoose.Schema({
    name:{
        type:String,
        required:'Name is required'
    },
    userName:{
        type:String,
        required:'userName is required'
    },
    isSupervisor:{
        type:Boolean,
        required:'isSupervisor is required'
    },
    password:{
        type:String,
        required:'Password is required'
    },
},{
    timestamps:true
}
)

module.exports = mongoose.model("User",userSchema)