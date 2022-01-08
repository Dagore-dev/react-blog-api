const blogsRouter = require('express').Router()
const Blog = require('../models/Blog')
const User = require('../models/User')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

blogsRouter.get('/:id', (request, response, next) => {
  const { id } = request.params

  Blog.findById(id)
    .then(blog => {
      if (blog) {
        response.json(blog)
      } else {
        response.status(404).end()
      }
    })
    .catch(err => {
      next(err)
    })
})

blogsRouter.delete('/:id', async (request, response, next) => {
  const { id } = request.params

  try {
    await Blog.findByIdAndDelete(id)
    response.status(204).end()
  } catch (err) {
    next(err)
  }
})

blogsRouter.post('/', async (request, response, next) => {
  const { title, body, author } = request.body

  if (title && body && author) {
    const user = await User.find({ id: author })

    const newBlog = new Blog({
      title,
      body,
      author: user._id
    })

    try {
      const savedBlog = await newBlog.save()
      response.json(savedBlog)
    } catch (err) {
      next(err)
    }
  } else {
    response.status(400).json({
      error: 'Something is missing'
    })
  }
})

blogsRouter.put('/:id', (request, response, next) => {
  const { id } = request.params
  const { title, body, author } = request.body

  const newBlogContent = {
    title: title,
    body: body,
    author: author
  }

  Blog.findByIdAndUpdate(id, newBlogContent, { new: true })
    .then(blog => {
      response.json(blog)
    })
    .catch(err => {
      next(err)
    })
})

module.exports = blogsRouter
