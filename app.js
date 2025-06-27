//Require Express
const express = require('express')
const app = express()

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
    console.log(req.body)
})

//update blog
app.patch("/blog/:id", (req,res)=>{
    res.render('singleBlog')
})

// delete blog
app.delete("/blog/:id", (req,res)=>{
    res.render('singleBlog')
})



const port = process.env.PORT
app.listen(port, (req,res)=>{
    console.log(`Project successfully started at ${port}`)
})