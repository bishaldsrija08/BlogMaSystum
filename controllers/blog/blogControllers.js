const e = require("express")
const { blogs, User } = require("../../model")

exports.createBlog = async (req, res) => {
    const userId = req.user.id // ❌ was req.user[0].id – req.user is an object, not an array
    const { title, subtitle, description } = req.body
    if (!title || !subtitle || !description || !req.file) {
        return res.status(400).send('All fields are required')
    }
    // console.log(req.file.filename)
    const image = req.file.filename // Get the uploaded file from the request

    await blogs.create({
        title,
        subtitle,
        description,
        image: process.env.IMAGE_UPLOAD_PATH + image, // Save the filename of the uploaded image
        userId
    })

    res.redirect('/')
}

exports.renderCreateBlogForm = (req, res) => {
    res.render('createBlog')
}

exports.getAllBlogs = async (req, res) => {
    const data = await blogs.findAll({
        include: {
            model: User //joining tables 
        }
    })
    res.render('blogs', { data })
}

exports.renderSingleBlog = async (req, res) => {
    const id = req.params.id
    const singleData = await blogs.findAll({
        where: { id: id },
        include: {
            model: User //joining tables 
        }
    })
    res.render('singleBlog', { data: singleData })
}

exports.renderEditBlogForm = async (req, res) => {
    const id = req.params.id
    //find single blog by id
    const singleData = await blogs.findAll({
        where: { id: id }
    })
    res.render('editBlog', { data: singleData })
}

exports.updateBlog = (req, res) => {
    const id = req.params.id
    const { title, subtitle, description } = req.body
    blogs.update({
        title: title,
        subtitle: subtitle,
        description: description
    }, {
        where: { id: id }
    })
    res.redirect('/')
}

exports.deleteBlog = async (req, res) => {
    const { id } = req.params
    await blogs.destroy({ where: { id: id } })
    res.redirect('/')
}

exports.renderMyBlogs = async (req, res) => {
    const id = req.user.id
    const myBlogs = await blogs.findAll({
        where: { userId: id }
    })
    res.render('myBlogs', { data: myBlogs }) // Pass the user object to the view
}