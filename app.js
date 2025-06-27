//Require Express
const express = require('express')
const app = express()

//database connection
require('./model/index.js')

//json buj
app.use(express.json())
app.use(express.urlencoded({extended:true}))

//require dotenv
require('dotenv').config()

//set view engine
app.set('view engine', 'ejs')

//css buj
app.use(express.static('public'))

//get all blogs in home page
app.get("/", (req,res)=>{
    res.render('blogs')
})

//get add blog form page
app.get("/blog", (req,res)=>{
    res.render('createBlog')
})

//create blog
app.post("/blog", (req,res)=>{
    const{ title, subtitle, description } = req.body
    console.log("This is the blog data", title, subtitle, description)
    res.json({
        message: "Blog created successfully"
    })
})

//update blog
app.patch("/blog/:id", (req,res)=>{
    res.render('singleBlog')
})

// delete blog
app.delete("/blog/:id", (req,res)=>{
    res.render('singleBlog')
})

//server starting in port
const port = process.env.PORT
app.listen(port, (req,res)=>{
    console.log(`Project successfully started at ${port}`)
})