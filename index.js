// require packages
require('dotenv').config()
const express = require('express')
const cookieParser = require('cookie-parser')
const db = require('./models')


//app config
const app = express()
const PORT = process.env.PORT || 8000
app.set('view engine', 'ejs')
//parse request bodies from html forms (req.body)
app.use(express.urlencoded({extended: false}))
//tell express to parse incoming cookies
app.use(cookieParser())

//custome auth middleware that checks the cookies for a user id
//and it finds one, look up the user in the db
//tell all downstream routes about this user

app.use(async (req, res, next) => {
    try {
        if (req.cookies.userId) {
        // the user is logged in, lets find them in the db
        const user = await db.user.findByPk(req.cookies.userId)
        //mount logged in user on the res.locals
        res.locals.user = user
        } else {
            // set logged in user to be null for conditonal rendering
            res.locals.user = null
        }
        //move in the next middleware route
        next()
    } catch(err){
        console.log('error in auth middleware:❌❌❌❌', err)
        next() // go to next thing
    }
})

//ex custom middleware(incoming request logger)
app.use((req, res, next) => {
    //our code goes here
    // console.log('hello from inside the middleware')
    console.log(`incoming request: ${req.method} - ${req.url}`)
    // res.locals are a place that we can put data to share with 'downstream routes"
    //res.locals.myData = 'hello i am data'
    //invoke next to tell express to go to the next route or middle
    next()
})

//routes and controllers
app.get('/', (req,res) => {
    // console.log(res.locals)
    res.render('home.ejs', {
        user: res.locals.user
    })
})

app.use('/users', require('./controllers/users'))


//listen on port
app.listen(PORT, () => {
    console.log(`authenticating users on PORT ${PORT}`)
})