// Main import
const express = require('express')

//Session import
const cookieParser = require("cookie-parser");
const sessions = require('express-session');

//Database queries
const db = require('./queries')

//Router import
const apiRouter = require('./routes')
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

//  Cookie Parser
app.use(cookieParser())

//  Router use
app.use('/api', apiRouter)

//Server Start
app.listen(PORT, () => {
    console.log(`Application running in port ${PORT}, link to access: http://localhost:${PORT} `)
})

