//Require Express
const express = require('express')

const blogRoutes = require('./routes/blogRoutes')
const cookieParser = require('cookie-parser')
const userRoutes = require('./routes/userRoutes')
const app = express()

//database connection
require('./model/index.js')

//json buj
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
//cookie parser
app.use(cookieParser())
app.use((req, res, next) => {
    res.locals.currentUser = req.cookies.token
    next()
})
//require dotenv
require('dotenv').config()

//set view engine
app.set('view engine', 'ejs')

//css buj
app.use(express.static('public/'))
app.use('/uploads/', express.static('uploads'))
//blog routes
app.use("/", blogRoutes)

// Auth starts 
app.use("/", userRoutes)

//server starting in port
const port = process.env.PORT
app.listen(port, (req, res) => {
    console.log(`Project successfully started at ${port}`)
})