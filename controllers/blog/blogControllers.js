const { blogs, User } = require("../../model")
const fs = require('fs')

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

exports.updateBlog = async (req, res) => {
    const id = req.params.id
    const { title, subtitle, description } = req.body
    //old data find gareko
    const oldImage = await blogs.findAll({
        where: {
            id: id
        }
    })
    let fileName
    //adi update garda file ako xa vane naya file halne natra puranai rakhne
    if (req.file) {
        fileName = process.env.IMAGE_UPLOAD_PATH + req.file.filename
        //Naya file ayac purano delete garney
        const oldImagePath = oldImage[0].image
        const fileNameActual = oldImagePath.slice(22)
        fs.unlink(`${fileNameActual}`, (err) => {
            if (err) {
                console.log("Error while deleting file" + err)
            } else {
                console.log("File Deleted successfully.")
            }
        })
    } else {
        fileName = oldImage[0].image
    }
    await blogs.update({
        title: title,
        subtitle: subtitle,
        description: description,
        image: fileName
    }, {
        where: { id: id }
    })
    res.redirect('/single/' + id)
}

exports.deleteBlog = async (req, res) => {
    const { id } = req.params

    const oldImage = await blogs.findAll({
        where: {
            id: id
        }
    })

    await blogs.destroy({ where: { id: id } })

    const oldImagePath = oldImage[0].image
    const fileNameActual = oldImagePath.slice(22)
    fs.unlink(`${fileNameActual}`, (err) => {
        if (err) {
            console.log("Error while deleting file" + err)
        } else {
            console.log("File Deleted successfully.")
        }
    })
    res.redirect('/')
}

exports.renderMyBlogs = async (req, res) => {
    const id = req.user.id
    const myBlogs = await blogs.findAll({
        where: { userId: id }
    })
    res.render('myBlogs', { data: myBlogs }) // Pass the user object to the view
}