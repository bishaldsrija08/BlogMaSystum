const db = require("../../model")
const { blogs, User } = require("../../model")
const fs = require('fs')
const sequelize = db.sequelize
exports.createBlog = async (req, res) => {
    try {
        const userId = req.user.id
        const { title, subtitle, description } = req.body
        if (!title || !subtitle || !description || !req.file) {
            return res.status(400).send('All fields are required')
        }

        const image = req.file.filename

        await blogs.create({
            title,
            subtitle,
            description,
            image: process.env.IMAGE_UPLOAD_PATH + image,
            userId
        })

        res.redirect('/')
    } catch (error) {
        console.error(error)
        res.status(500).send("Internal Server Error")
    }
}

exports.renderCreateBlogForm = (req, res) => {
    res.render('createBlog')
}

exports.getAllBlogs = async (req, res) => {
    try {
        const success = req.flash("success")
        // const data = await blogs.findAll({
        //     include: {
        //         model: User
        //     }
        // })
        const data = await sequelize.query("SELECT * FROM blogs", {
            type: sequelize.QueryTypes.SELECT
        })
        console.log(data)
        res.render('blogs', { data, success })
    } catch (error) {
        console.error(error)
        res.status(500).send("Internal Server Error")
    }
}

exports.renderSingleBlog = async (req, res) => {
    try {
        const id = req.params.id
        const singleData = await blogs.findAll({
            where: { id: id },
            include: {
                model: User
            }
        })
        res.render('singleBlog', { data: singleData })
    } catch (error) {
        console.error(error)
        res.status(500).send("Internal Server Error")
    }
}

exports.renderEditBlogForm = async (req, res) => {
    try {
        const id = req.params.id
        const singleData = await blogs.findAll({
            where: { id: id }
        })
        res.render('editBlog', { data: singleData })
    } catch (error) {
        console.error(error)
        res.status(500).send("Internal Server Error")
    }
}

exports.updateBlog = async (req, res) => {
    try {
        const id = req.params.id
        const { title, subtitle, description } = req.body
        const oldImage = await blogs.findAll({
            where: {
                id: id
            }
        })
        let fileName
        if (req.file) {
            fileName = process.env.IMAGE_UPLOAD_PATH + req.file.filename
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
    } catch (error) {
        console.error(error)
        res.status(500).send("Internal Server Error")
    }
}

exports.deleteBlog = async (req, res) => {
    try {
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
    } catch (error) {
        console.error(error)
        res.status(500).send("Internal Server Error")
    }
}

exports.renderMyBlogs = async (req, res) => {
    try {
        const id = req.user.id
        const myBlogs = await blogs.findAll({
            where: { userId: id }
        })
        res.render('myBlogs', { data: myBlogs })
    } catch (error) {
        console.error(error)
        res.status(500).send("Internal Server Error")
    }
}