const { Schema, model } = require('mongoose')

const blogSchema = new Schema({
  title: String,
  body: String,
  author: String
})

// Transforma la respuesta que recibimos eliminado o renombrando las propiedades del objeto
blogSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const Blog = model('Blog', blogSchema)

module.exports = Blog

// Blog.find({})
//   .then(res => {
//     console.log(res)
//   })
//   .catch(err => {
//     console.error(err)
//   })
//   .finally(() => mongoose.connection.close())

// const blog = new Blog({
//   title: 'Creada con mongoose',
//   body: 'Este post está creado siguiendo un esquema a nivel de aplicación.',
//   author: 'Dagore'
// })

// blog.save()
//   .then(res => {
//     console.log(res)
//   })
//   .catch(err => {
//     console.error(err)
//   })
//   .finally(() => mongoose.connection.close())
