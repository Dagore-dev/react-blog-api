const { Schema, model } = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const userSchema = new Schema({
  username: { type: String, unique: true },
  name: String,
  passwordHash: String,
  blogs: [{
    type: Schema.Types.ObjectId, // Decimos que se trata de una array con elementos de tipo ObjectId y además sirven de referencia a modelo Blog.
    ref: 'Blog'
  }]
})

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id
    delete returnedObject._id
    delete returnedObject.__v
    delete returnedObject.passwordHash// Eliminamos el password del objeto que saca de la base de datos porque no debe ser desvelado.
  }
})

userSchema.plugin(uniqueValidator)
const User = model('User', userSchema)

module.exports = User
