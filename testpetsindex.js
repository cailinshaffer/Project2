const db = require('./models')

// db.pets.create ({
//     type: "Dog" ,
//     age: 8,
//     breed: "Husky"
// })
// .then(pets => {
//     console.log(pets.get())
// })

// const createPet = async () => {
//     try {
//         const newPet = await db.pets.create({
//             type: "Dog" ,
//             age: 2,
//             breed: "GermanShepherd",
//         })
//         console.log(newPet)
//     } catch (err) {
//           console.log(err)
//     }
// }
// createPet()


// db.comment.create ({
//     comment: 'What a cute puppers',

//     petId: 1,
//     userId: 1,
// })
// .then(comment => {
//     console.log(comment.get())
// })



// const findPets = async () => {
//     try {
//       const pet = await db.pets.findOne({
//         where: { id: 1},
//         // include: [db.type]
//       })
//       console.log(pet)
//     } catch (err) {
//       console.log(err)
//     }
//   }
//   findPets()

