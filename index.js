require('dotenv').config()// Lo primero que tenemos que hacer en nuestra aplicación es ejecutar dotenv.config() para que busque las variables de .env y las asigne correctamente.
require('./mongo')// Se conecta a la base de datos, si no lo guardas en una variable CommonJS lo que hace es ejecutar el contenido
const express = require('express')
const logger = require('./loggerMiddleware')
const cors = require('cors')
const Blog = require('./models/Blog')

const app = express()
const PORT = process.env.PORT

app.use(express.json())// body-parser necesario para realizar POST
app.use(logger)
app.use(cors())// Cors previene un error que surge cuando se intenta acceder a recursos desde un puerto distinto al de los recursos. Puedes limitar los orígenes que pueden acceder.

app.get('/', (req, res) => {
  res.send('<h1>Hello world</h1>')
})

app.get('/blogs', (req, res) => {
  Blog.find({})
    .then(blogs => {
      res.json(blogs)
    })
    .catch(err => {
      console.error(err)
    })
})

app.get('/blogs/:id', (req, res, next) => {
  const { id } = req.params

  Blog.findById(id)
    .then(blog => {
      if (blog) {
        res.json(blog)
      } else {
        res.status(404).end()
      }
    })
    .catch(err => {
      next(err)
    })
})

app.delete('/blogs/:id', (req, res, next) => {
  const { id } = req.params
  Blog.findByIdAndRemove(id)
    .then(() => {
      res.status(204).end()
    })
    .catch(err => {
      next(err)
    })
})

app.post('/blogs', (req, res) => {
  const blog = req.body

  if (blog.title && blog.body && blog.author) {
    const newBlog = new Blog({
      title: blog.title,
      body: blog.body,
      author: blog.author
    })

    newBlog.save()
      .then(savedBlog => {
        res.json(savedBlog)
      })
      .catch(err => {
        console.error(err)
      })
  } else {
    res.status(400).json({
      error: 'Something is missing'
    })
  }
})

app.put('/blogs/:id', (req, res, next) => {
  const { id } = req.params
  const blog = req.body

  const newBlogContent = {
    title: blog.title,
    body: blog.body,
    author: blog.author
  }

  Blog.findByIdAndUpdate(id, newBlogContent, { new: true })
    .then(blog => {
      res.json(blog)
    })
    .catch(err => {
      next(err)
    })
})

app.use((req, res, next) => { // REVISAR NO ESTÁ ENTRANDO
  res.status(404).json({
    error: 'Not found'
  })
})

app.use((error, req, res, next) => {
  console.error(error)
  if (error.name === 'CastError') {
    res.status(400).send({ error: 'Used id is malformed' })
  } else {
    res.status(500).end()
  }
})

app.listen(PORT, () => console.log(`Server running on ${PORT}`))
