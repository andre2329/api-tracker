const express = require('express')
const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

//Bring in the  routes
app.use('/user',require('./src/routes/user'))
app.use('/chatroom',require('./src/routes/chatroom'))
app.use('/client',require('./src/routes/client'))
//cross origin
app.use(require('cors')())
//setup 
const errorHandlers = require('./src/handlers/errorHandlers')

app.use(errorHandlers.notFound)
app.use(errorHandlers.mongoseErrors)
if (process.env.ENV == "DEVELOPMENT")
    app.use(errorHandlers.developmentErrors)
else
    app.use(errorHandlers.productionErrors)

module.exports = app

