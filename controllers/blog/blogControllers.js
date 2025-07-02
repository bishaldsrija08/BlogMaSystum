const { blogs } = require("../../model")

exports.createBlog = async (req, res) => async (req, res) => {
    const { title, subtitle, description } = req.body
    await blogs.create({
        title: title,
        subtitle: subtitle,
        description: description
    })
    res.redirect('/')
}

exports.renderCreateBlogForm = (req, res) => {
    res.render('createBlog')
}


exports.getAllBlogs = async (req, res) => {
    const data = await blogs.findAll()
    res.render('blogs', { data })
}

exports.renderSingleBlog = async (req, res) => {
    const id = req.params.id
    const singleData = await blogs.findAll({
        where: { id: id }
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

