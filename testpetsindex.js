require('dotenv').config()
const express = require('express')
const cookieParser = require('cookie-parser')
const db = require('./models')
const crypto = require('crypto-js')
const axios = require('axios')

//app config
const app = express()
const PORT = process.env.PORT || 8000
app.set('view engine', 'ejs')
const CLIENT_ID = process.env.CLIENT_ID
const SECRET_ID = process.env.SECRET_ID

async function fetchPets() {
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

        console.log('data response:', dataResponse.data)
    } catch (err) {
        console.log(err)
    }
}

fetchPets()



//listen on port
app.listen(PORT, () => {
    console.log(`authenticating users on PORT ${PORT}`)
})