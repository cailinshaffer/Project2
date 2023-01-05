// require packages
require('dotenv').config()
const express = require('express')
//const request = require('request')
const cookieParser = require('cookie-parser')
const db = require('./models')
const crypto = require('crypto-js')
const axios = require('axios') 
const fs = require('fs')

//app config
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
const petUrl = "https://api.petfinder.com/v2/animals"

//custome auth middleware that checks the cookies for a user id
//and it finds one, look up the user in the db
//tell all downstream routes about this user

app.use(async (req, res, next) => {
    try {
        if (req.cookies.userId) {
        //decrypt user id and turn it into a string
        const decryptedId = crypto.AES.decrypt(req.cookies.userId, process.env.SECRET)
        const decryptedString = decryptedId.toString(crypto.enc.Utf8)
        // the user is logged in, lets find them in the db
        const user = await db.user.findByPk(decryptedString)
        //mount logged in user on the res.locals
        res.locals.user = user
        } else {
            // set logged in user to be null for conditonal rendering
        
            res.locals.user = null
        }
        //move in the next middleware route
        next()
    } catch(err) {
        console.log('error in auth middleware:❌❌❌❌', err)
        //explpicitly set user to null if there is an error
        res.locals.user = null
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


// async function fetchPets() {
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

//         console.log('data response:', dataResponse.data)
//     } catch (err) {
//         console.log(err)
//     }
// }
// fetchPets()



// routes for retrieving animals

//  GET animal  GET https://api.petfinder.com/v2/animals
// app.get('/animals', (req, res) => {
//     res.send("animals here")
// })




app.get('/pets', async (req,res) => {
    try{
        // const animals = fs.readFileSync('/animals')
        // let animalData = JSON.parse(animals)
        // let animalUrl = 'https://api.petfinder.com/v2/animals'
        // axios.get(animalUrl).then(response => {
        //     //let animal = apiResponse.data.results
        //     res.send(response.data)
        // })
       
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
    
    
    const dataResponse = await axios.get('https://api.petfinder.com/v2/animals', options)
       res.send(dataResponse.data)
    //    res.render('pets/search.ejs')
    }catch(err){
        console.log(err)
    }
})



// GET all 
app.get('/pets/search', async (req, res) => {
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
    
    const dataResponse = await axios.get('https://api.petfinder.com/v2/animals', options)
    //console.log(`incoming request: ${req.method} - ${req.url}`)
      res.render('pets/search.ejs')
    //res.send(dataResponse.data)
    }catch(err){
        console.log(err)

         //fetchPets()
    }
   res.render('pets/search.ejs')
    
    //res.send("search animals")
})



// app.get('/animails', async (req, res) => {
//     const body = {
//         'grant_type': 'client_credentials',
//         'client_id': CLIENT_ID,
//         'client_secret': SECRET_ID

//     }

//     // https://api.petfinder.com/v2/oauth2/token
//     const tokenUrl = 'https://api.petfinder.com/v2/oauth2/token'
//     const tokenResponse = await axios.post(tokenUrl, body)
//     console.log('bearer token reponse:', tokenResponse.data)

//     const options = {
//         headers: {
//             Authorization: `Bearer ${tokenResponse.data.access_token}`
//         }
//     }

//     // const dataResponse = await axios.get('https://api.petfinder.com/v2/animals?type=dog&page=2', options)
//     // let qs = {
//     //   s: 'animals',
//     //   access_token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiJmamZrdzF1T1RjdWFVT0ljc2llTHFPbVcycWNVOE5sQjQ4OE5Edk1xODZRdDNtMTVURSIsImp0aSI6ImYyZTVhMWM1MzNiNGU5ODc2ODdkOWY1OTJlN2Q4Y2ZjODA3ZTkzOWMwYzJlMDRiZmRhZmU5Y2IzMWQ1ODRlODk1ZjI2ODNmMmYzOTZiMWMxIiwiaWF0IjoxNjcyNzcxNjA2LCJuYmYiOjE2NzI3NzE2MDYsImV4cCI6MTY3Mjc3NTIwNiwic3ViIjoiIiwic2NvcGVzIjpbXX0.zOFa14wsoAnPbV7wNZRvDodCrQtNs89UMqbKUb-HnNSBhS1wvxuiVr6oMWs7pm1rN6dqJek78xuMLmJwDq0bdT75dxh4P3kbTr4BKP15RzOxW7Jjcsl9K3xR4OyaMmdh1cWI6QLK9yh8SgVlF7VyC7uqPhLWnlE54d5rnVsDbdSbOPgWFjG0A3QWwigNSUHEjH5DlKQ0xGLQPGw4nROEe3P6Cs5wiNWISPaw5Z_O4ikiTpM7cLbymknYeQiAzw86XB4-dZnUAYbHnFWBsaCFf1WPZvXSojINvybKe9A2J1iLzcGb5AHIlu_gDN7ctAVU2A2rzqrH66My6FxqKepIuA'
//     // };
  
//     // request({
//     //   url: 'https://api.petfinder.com/v2/animals',
//     //   qs: qs
//     // }, function (error, response, body) {
//     //   if (!error && response.statusCode == 200) {
//     //     var dataObj = JSON.parse(body);
//     //     res.send(dataObj.Search);
//     //   }
//     // });
//   });





// app.get('/animals', async (req,res) => {
//     const body = {
//         'grant_type': 'client_credentials',
//         'client_id': CLIENT_ID,
//         'client_secret': SECRET_ID

//     }

//     // https://api.petfinder.com/v2/oauth2/token
//     const tokenUrl = 'https://api.petfinder.com/v2/oauth2/token'
//     const tokenResponse = await axios.post(tokenUrl, body)
//     console.log('bearer token reponse:', tokenResponse.data)

//     const options = {
//         headers: {
//             Authorization: `Bearer ${tokenResponse.data.access_token}`
//         }
//     }

//     const dataResponse = await axios.get('https://api.petfinder.com/v2/animals?type=dog&page=2', options)
   
   
//     let animalUrl = 'https://api.petfinder.com/v2/animals'
//     axios.get(animalUrl).then(apiResponse => {
//         let animal = apiResponse.data.results
//         res.render(animal)
//     })
// })


//listen on port
app.listen(PORT, () => {
    console.log(`authenticating users on PORT ${PORT}`)
})