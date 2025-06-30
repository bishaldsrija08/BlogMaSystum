//Require Express
const express = require('express')
const { blogs } = require('./model/index.js')
const { where } = require('sequelize')
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

//get all blogs in home page
app.get("/", async (req, res) => {
    const data = await blogs.findAll()
    res.render('blogs', { data })
})


//get single blogs in home page
app.get("/single/:id", async (req, res) => {
    const id = req.params.id
    const singleData = await blogs.findAll({
        where: { id: id }
    })
    res.render('singleBlog', { data: singleData })
})

//get add blog form page
app.get("/blog", (req, res) => {
    res.render('createBlog')
})

//get edit blog form page
app.get("/edit/:id", async (req, res) => {
    const id = req.params.id
    //find single blog by id
    const singleData = await blogs.findAll({
        where: { id: id }
    })
    res.render('editBlog', { data: singleData })
})

//create blog
app.post("/create", async (req, res) => {
    const { title, subtitle, description } = req.body
    await blogs.create({
        title: title,
        subtitle: subtitle,
        description: description
    })
    res.redirect('/')
})

//update blog
app.post("/edit/:id", (req, res) => {
    const id = req.params.id
    const { title, subtitle, description } = req.body
    blogs.update({
        title: title,
        subtitle: subtitle,
        description: description
    }, {
        where: { id: id }
    })
    res.send("Blog updated successfully")
})

// delete blog
app.get("/delete/:id", async (req, res) => {
    const { id } = req.params
    await blogs.destroy({ where: { id: id } })
    res.redirect('/')
})

//server starting in port
const port = process.env.PORT
app.listen(port, (req, res) => {
    console.log(`Project successfully started at ${port}`)
})