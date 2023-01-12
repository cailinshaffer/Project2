const express = require('express')
const db = require('../models')
const axios = require('axios')
const router = express.Router()


const CLIENT_ID = process.env.CLIENT_ID
const SECRET_ID = process.env.SECRET_ID



// router.get('/:id', async (req, res) => {
//     //res.send("comments bruh")
//     try { 
        
//         const comments = await db.comment.findAll({
//             where: {
//                 // userId: req.params.userId,
//                 comments: req..comment
//             }
//         })
//         console.log("comments here", comments) 
      
//          const body = {
//              'grant_type': 'client_credentials',
//              'client_id': CLIENT_ID,
//              'client_secret': SECRET_ID
     
//          }
     
//          // https://api.petfinder.com/v2/oauth2/token
//          const tokenUrl = 'https://api.petfinder.com/v2/oauth2/token'
//          const tokenResponse = await axios.post(tokenUrl, body)
//          //console.log('bearer token reponse:', tokenResponse.data)
     
//          const options = {
//              headers: {
//                  Authorization: `Bearer ${tokenResponse.data.access_token}`
//              }
//          } 
//          const dataResponse = await axios.get(`https://api.petfinder.com/v2/animals?type=${comments}`, options)
         
//          res.render('pets/details.ejs', {
//           comments: req.body.comments
//         })
      

//              } catch(err) {
//         console.log("❌❌❌❌❌", err)
//     }


// })


router.post('/', async (req, res) => {
    try {
        console.log(req.body)
        const [pet] = await db.pet.findOrCreate({
            where: {
                petId:req.body.petId
            },
            defaults:{
                type:req.body.type,
                age:req.body.age,
                breed:req.body.breed
            }
        })

        const userComment = await db.comment.create({
            petId: pet.id,
            userId: res.locals.user.id,
            comment: req.body.comment
            
    
        })

        res.redirect(`/pets/${pet.petId}`)

        console.log('comments here', userComment)
        //console.log('data response:', dataResponse.data)
    } catch (err) {
        console.log(err)
    }
})








// export the router
module.exports = router