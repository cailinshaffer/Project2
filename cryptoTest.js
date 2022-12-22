// encrpytion is a 2 way process -- data is "encrypted"  using an algorithm and key
// you must know what the key is to decrpyt or unscramble the data


// use crpyto-js for encription
const mySecret = 'i eat cookies for breakfast'

const secretKey = 'myPassword'

// Advanced Encrpytion Standard
const crypto = require('crypto-js')

myEncryption = crypto.AES.encrypt(String(100), secretKey)
console.log(myEncryption.toString()) //let see our encrypted data

const decrpyt = crypto.AES.decrypt(myEncryption.toString(), secretKey)
console.log(decrpyt.toString(crypto.enc.Utf8))

//passwords in the database will be hashed
//hashing is a one way process, once hashed you cannot unhash it
//hashing functions always return a hash of equal length regardless of input
// hashing function always return the out given the same input
const bcrypt = require('bcrypt')

const userPassword = '1234password'
//when the user signs up we want to hash their password and save it in the db
const hashedPassword = bcrypt.hashSync(userPassword, 12)
console.log(hashedPassword)

//COMPARE a string to our hash (user login) // "hashedPassword" goes last
// console.log(bcrypt.compareSync(userPassword, hashedPassword))

// // COMPARE a string to our hash (user login)
// console.log(bcrypt.compareSync('wrong', hashedPassword))

// // node js's built in crytpo pack
// const cryptoNode = require('crypto')

const hash = cryptoNode.createHash('sha256').update('password123', 'utf8').digest()
console.log(hash.toString('hex'))

