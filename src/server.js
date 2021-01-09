const jwt = require('jsonwebtoken')
require('dotenv').config()

const mongoose = require("mongoose")

mongoose.connect(process.env.DATABASE,{
    useUnifiedTopology:true,
    useNewUrlParser:true
})

mongoose.connection.on("error",(err)=>{
    console.log("Mongoose connection ERROR: " + err.message)
})

mongoose.connection.once('open',()=>{
    console.log("MongoDB connected!")
})
//bring in the models

require('./models/User')
require('./models/Chatroom')
require('./models/Message')
require('./models/Client')

const app = require('../app')
const Chatroom = require('./models/Chatroom')
const User = require('./models/User')
const Client = require('./models/Client')


const server = app.listen(process.env.PORT,'0.0.0.0',()=>{
    console.log('server started on port '+process.env.PORT)
})
