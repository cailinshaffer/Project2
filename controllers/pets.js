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


// GET search page
router.get('/search', async (req, res) => {
    //console.log(req.query.pets)
   res.render('pets/search.ejs')
    
    //res.send("search animals")
})



//GET results from search
router.get('/results', async (req, res) => {
    try{
      const petType = req.query.petType
      console.log(petType)
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
     
      
    const dataResponse = await axios.get(`https://api.petfinder.com/v2/animals?type=${petType}`, options)

    //console.log(dataResponse.data)
    //console.log(dataResponse.data.animals[0].photos)
    
    // res.send(dataResponse.data.animals)
     
     res.render('pets/results.ejs', {
        pets: dataResponse.data.animals,
        
    })
    
   } catch (err) {
       console.log(err)
   }
})






router.get('/:id', async (req, res) => {
    try { 
        let petId = req.params.id
        
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
       
        
      const dataResponse = await axios.get(`https://api.petfinder.com/v2/animals/${petId}`, options)
         console.log(dataResponse.data.animal)
        
        //console.log(petId + "\n\n\n\n")
        res.render('pets/details.ejs', {
            data: dataResponse.data.animal
        })
    } catch (error) {
        console.log(error)
    }
})





// export the router
module.exports = router