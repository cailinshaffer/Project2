require('dotenv').config()
const express = require('express')
const cookieParser = require('cookie-parser')
const db = require('../models')
const crypto = require('crypto-js')
const axios = require('axios')
const router = express.Router()

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



// GET search route page for looking up pet type
router.get('/search', async (req, res) => {
    //console.log(req.query.pets)
   res.render('pets/search.ejs')
    
    //res.send("search animals")
})



//GET results from search show pet name and show photo
router.get('/results', async (req, res) => {
    try{
        ////look up pet type in the database
      const petType = req.query.petType
      //console.log(petType)
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



// GET route for each pets profile by petId
router.get('/:id', async (req, res) => {
    try { 
        
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
        //  declare pet id
         let petId = req.params.id
      const dataResponse = await axios.get(`https://api.petfinder.com/v2/animals/${petId}`, options)
         //console.log(dataResponse.data.animal)

         const findPet = await db.pet.findOne({
            where: {
                petId:petId
            }
        })
        // console.log(findPet)
        
        let comments = [] 
        if (findPet){
            comments = await findPet.getComments()
        }
        
        //console.log(comments)

        //console.log(petId + "\n\n\n\n")
        res.render('pets/details.ejs', {
            data: dataResponse.data.animal, comments:comments
        })
    } catch (error) {
        console.log(error)
    }
})















// export the router
module.exports = router