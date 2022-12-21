// require packages
require('dotenv').config()
const express = require('express')


//app config
const app = express()
const PORT = process.env.PORT || 8000
app.set('view engine', 'ejs')
//parse request bodies from html forms (req.body)
app.use(express.urlencoded({extended: false}))

//routes and controllers
app.get('/', (req,res) => {
    res.render('home.ejs')
})

app.use('/users', require('./controllers/users'))


//listen on port
app.listen(PORT, () => {
    console.log(`authenticating users on PORT ${PORT}`)
})