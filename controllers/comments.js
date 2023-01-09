require('dotenv').config()
const express = require('express')
const cookieParser = require('cookie-parser')
const db = require('../models')
const crypto = require('crypto-js')
const axios = require('axios')
const router = express.Router()



//APP CONFIG
const app = express()
const PORT = process.env.PORT || 8000
app.set('view engine', 'ejs')
//parse request bodies from html forms (req.body)
app.use(express.urlencoded({extended: false}))
//tell express to parse incoming cookies
app.use(cookieParser())
app.set('view engine', 'ejs')
const CLIENT_ID = process.env.CLIENT_ID
const SECRET_ID = process.env.SECRET_ID
const bodyParser = require('body-parser')


router.get('/:id', async (req, res) => {
    //res.send("comments bruh")
    try { 
        
        const comments = await db.comments.findAll({
            where: {
                // userId: req.params.userId,
                comments: req.body.comments
            }
        })
        console.log("comments here", comments) 
      
         const body = {
             'grant_type': 'client_credentials',
             'client_id': CLIENT_ID,
             'client_secret': SECRET_ID
     
         }
     
         // https://api.petfinder.com/v2/oauth2/token
         const tokenUrl = 'https://api.petfinder.com/v2/oauth2/token'
         const tokenResponse = await axios.post(tokenUrl, body)
         //console.log('bearer token reponse:', tokenResponse.data)
     
         const options = {
             headers: {
                 Authorization: `Bearer ${tokenResponse.data.access_token}`
             }
         } 
         const dataResponse = await axios.get(`https://api.petfinder.com/v2/animals?type=${comments}`, options)
         
         res.render('pets/details.ejs', {
          comments: req.body.comments
        })
      

             } catch(err) {
        console.log("❌❌❌❌❌", err)
    }


})


router.post('/new', async (req, res) => {
    try {
        const body = {
            'grant_type': 'client_credentials',
            'client_id': CLIENT_ID,
            'client_secret': SECRET_ID

        }

        // https://api.petfinder.com/v2/oauth2/token
        const tokenUrl = 'https://api.petfinder.com/v2/oauth2/token'
        const tokenResponse = await axios.post(tokenUrl, body)
        console.log('bearer token reponse:', tokenResponse.data)

        const options = {
            headers: {
                Authorization: `Bearer ${tokenResponse.data.access_token}`
            }
        }

        const dataResponse = await axios.get('https://api.petfinder.com/v2/animals?type=dog&page=2', options)
        const userComment = await db.comment.findOrCreate({
            where: {
                
                comments: req.body.comments
            }
            
        })
        res.redirect('pets/results.ejs')

        console.log('comments here', comments)
        //console.log('data response:', dataResponse.data)
    } catch (err) {
        console.log(err)
    }
})




// router.post('/', async (req, res) => {
//     try {
//         const body = {
//             'grant_type': 'client_credentials',
//             'client_id': CLIENT_ID,
//             'client_secret': SECRET_ID

//         }

//         // https://api.petfinder.com/v2/oauth2/token
//         const tokenUrl = 'https://api.petfinder.com/v2/oauth2/token'
//         const tokenResponse = await axios.post(tokenUrl, body)
//         console.log('bearer token reponse:', tokenResponse.data)

//         const options = {
//             headers: {
//                 Authorization: `Bearer ${tokenResponse.data.access_token}`
//             }
//         }

//         const dataResponse = await axios.get('https://api.petfinder.com/v2/animals?type=dog&page=2', options)
//         const comment = await db.comment.findOrCreate({
//             where: {
//                 petType: req.params.id
//             }
//             //res.redirect('pets/results.ejs', {pet:dataResponse.data.pets})
//         })
//         console.log('comments here', comment)
//         //console.log('data response:', dataResponse.data)
//     } catch (err) {
//         console.log(err)
//     }
// })




// export the router
module.exports = router