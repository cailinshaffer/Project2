// create an instance of express routers
const express = require('express')
const db = require('../models')
const router = express.Router()
const crypto = require('crypto-js')
const bcrypt = require('bcrypt')
const methodOverride = require('method-override');


// mount our routes on the router

// GET /users/new -- serves a form to create a new user
router.get('/new', (req, res) => {
    res.render('users/new.ejs', {
        user: res.locals.user
    })
})

// POST /users -- creates a new user from the form @ /users/new
router.post('/', async (req, res) => {
    try {
        // based on the info in the req.body, find or create user
        const [newUser, created] = await db.user.findOrCreate({
            where: {
                email: req.body.email
            },
           
        }) 
        // if user is found redirect user to login
        if (!created) {
            console.log('user exist!')
            res.redirect('/users/login?message=Please Log in to continue.')
        } else {
            //here we know its a new user
            //hash the supplied password
            const hashedPassword = bcrypt.hashSync(req.body.password, 12)
            //save user w the new password
            newUser.password = hashedPassword
            await newUser.save() // actuall save new password in db
            // encrypt the new useres id an convert it to a string
            const encryptedId = crypto.AES.encrypt(String(newUser.id), process.env.SECRET)
            const encryptedIdString = encryptedId.toString()
            //place the encrypted id in a cookie
            res.cookie('userId', encryptedIdString)
            //redirect to users profile
            res.redirect('/users/profile')
        }
       
    } catch (err) {
        console.log(err)
        res.status(500).send('server error')
    }
})

// GET /users/login -- render a login form that POSTs to /users/login
router.get('/login', (req, res) => {
    res.render('users/login.ejs', {
        message: req.query.message ? req.query.message : null,
        user: res.locals.user
    })
})

// POST /users/login -- ingest data from form rendered @ GET /users/login
router.post('/login', async (req, res) => {
    try {
        // look up the user based on their email
        const user = await db.user.findOne({
            where: {
                email: req.body.email
            }
        })
        // boilerplate message if login fails
        const badCredentialMessage = 'username or password incorrect'
        if (!user) {
            // if the user isn't found in the db 
            res.redirect('/users/login?message=' + badCredentialMessage)
        } else if (!bcrypt.compareSync(req.body.password, user.password)) {
            // if the user's supplied password is incorrect
            res.redirect('/users/login?message=' + badCredentialMessage)
        } else {
            // if the user is found and their password matches log them in
            console.log('loggin user in!')
             // encrypt the new useres id an convert it to a string
             const encryptedId = crypto.AES.encrypt(String(user.id), process.env.SECRET)
             const encryptedIdString = encryptedId.toString()
             //place the encrypted id in a cookie
             res.cookie('userId', encryptedIdString)
             res.redirect('/users/profile')
        }
    } catch (err) {
        console.log(err)
        res.status(500).send('server error')
    }
})

// GET /users/logout -- clear any cookies and redirect to the homepage
router.get('/logout', (req, res) => {
    // log the user out by removing the cookie
    // make a get req to /
    res.clearCookie('userId')
    res.redirect('/')
})

// GET /users/profile -- show the user their profile page
router.get('/profile', (req, res) => {
    // if the user is not logged in -- they are not allowed to be here
    if (!res.locals.user) {
        res.redirect('/users/login?message=You must authenticate before you are authorized to view this resource!')
    } else {
        res.render('users/profile.ejs', {
            user: res.locals.user
        })
    }
})



//PUT /users/profile -- update password
router.put ("/:id", async (req, res) => {
    try {
        const updatePassword = await db.user.update(
            {password: bcrypt.hashSync(req.body.password, 12)} ,{
                where: {
                    email: res.locals.user
                }
            }
        )
            console.log(updatePassword + "\n\n\n\n")
    res.redirect('/users/profile')
    } catch(err) {
      console.log("❌❌❌❌❌", err)
    }
})

// export the router
module.exports = router

