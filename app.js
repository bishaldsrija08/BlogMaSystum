const express = require('express')
const app = express()

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

app.listen(4000, () => {
  console.log('Server is running on port 4000')
})