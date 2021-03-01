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
require('./models/Route')

const app = require('../app')
const Chatroom = require('./models/Chatroom')
const User = require('./models/User')
const Client = require('./models/Client')
const Route = require('./models/Route')

const server = app.listen(process.env.PORT || 5000,'0.0.0.0',()=>{
    console.log('server started on port '+process.env.PORT)
})

const io = require("socket.io")(server);
const RouteMongoose = mongoose.model("Route")

io.use(async (socket, next) => {

    // console.log('======nuevo====')
    // console.log(socket.handshake.query.token)
    try {

      const token = socket.handshake.query.token;
      const payload = await jwt.verify(token, process.env.SECRET);
      socket.userId = payload.id;
      // console.log("userId:")
      next()
    } catch (err) {
        console.log('[ERROR] [Name]'+ err)
        console.log('[ERROR] [Socket]'+ socket)
        console.log(socket.handshake)
    }
  });

  let totalUsers = 0
  io.on("connection", (socket) => {
    console.log("Connected: " + socket.userId);
    socket.on("disconnect", () => {
      console.log("Disconnected: " + socket.userId);
    });
  
    socket.on("joinRoom", ({ id }) => {
      socket.join(id);
      totalUsers++
      console.log("A user joined room: " + id);
      console.log('Users: '+ totalUsers)
    });
  
    socket.on("leaveRoom", ({ id }) => {
      socket.leave(id);
      console.log("A user left chatroom: " + id);
      totalUsers--
      console.log('Users: '+ totalUsers)
    });
  
    socket.on("chatRoomLocation", async ({ id, data }) => {
      let date = new Date(data.time);
        io.to(id).emit("newLocation", {
          data,
          userId: socket.userId,
          date
        });
      date = date.getDate()+"/"+(date.getMonth()+1)+"/"+date.getFullYear()
      // console.log(date)
        try{
        
        await  RouteMongoose.findOneAndUpdate(
            {
              idVendedor:id,
              fecha:date
            },
            {
                $push:{
                  route:{
                    latitude: data.latitude,
                    longitude: data.longitude
                  }
                
              }
        }, {upsert:true,new: true,setDefaultsOnInsert: true,useFindAndModify:false})
        }catch(e){
          console.log(e)
        }
        
    });
  });