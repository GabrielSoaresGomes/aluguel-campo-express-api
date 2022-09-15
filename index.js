// Main import
const express = require('express')

//Session import
const cookieParser = require("cookie-parser");
const sessions = require('express-session');

//Database queries
const db = require('./queries')

//Server Config
const app = express()
const PORT = 3000

//Middlewares
//  Parse the request data
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
//  Session
const oneDay = 1000 * 60 * 60 * 24;
const secretKey = "thisismysecrctekeyfhrgfgrfrty84fwir767"
app.use(sessions({
    secret: secretKey,
    saveUninitialized:true,
    cookie: { maxAge: oneDay },
    resave: false
}))
var session;
//  Cookie Parser
app.use(cookieParser())

//Routes
//  get
app.get('/users', db.getUsers)
app.get('/users/:id', db.getUserById)
app.get('/campos', db.getCampos)
app.get('/campos/:id', db.getCampoById)
app.get('/', (request,  response) => {
    response.json({info: "Hello, this is the home page!"})
})
//  post
app.post('/users', db.createUser)
app.post('/login',db.loginUser)
app.get('/logout', db.logoutUser)
//  put
app.put('/users/:id', db.updateUser)
app.put('/campo/:id/lease', db.alugarCampo)
//  delete
app.delete('/users/:id', db.deleteUser)


//Server Start
app.listen(PORT, () => {
    console.log(`Aplication running in port ${PORT}, link to access: http://localhost:${PORT} `)
})

module.exports = session