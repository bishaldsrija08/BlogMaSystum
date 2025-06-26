const express = require('express')
const app = express()
require('dotenv').config();

//ejs buj
app.set('view engine', 'ejs')

//css buj
app.use(express.static('public'))

app.get('/', (req, res) => {
  res.render('home', { data: 'Hello World!' })
})

app.get('/about', (req, res) => {
  res.render('about', { data: 'About Us' })
})

const port = process.env.PORT
app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})