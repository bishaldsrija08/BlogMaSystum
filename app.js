//Require Express
const express = require('express')

const blogRoutes = require('./routes/blogRoutes')
const userRoutes = require('./routes/userRoutes')
const { createUser, loginUser, renderLoginForm, renderRegisterForm } = require('./controllers/auth/userControllers.js')
const app = express()

//database connection
require('./model/index.js')

//json buj
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

//require dotenv
require('dotenv').config()

//set view engine
app.set('view engine', 'ejs')

//css buj
app.use(express.static('public/'))

//blog routes
app.use("/", blogRoutes)

// Auth starts 
app.use("/", userRoutes)

//server starting in port
const port = process.env.PORT
app.listen(port, (req, res) => {
    console.log(`Project successfully started at ${port}`)
})