const mongoose = require('mongoose')
const Blog = require('../models/Blog')
const initialBlogs = require('./helpers/initialsBlogs')
const {
  api,
  getFromBlogs
} = require('./helpers/getFromBlogs')

describe('blogs', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})// Antes de los test elimina todas las notas del entorno de testing.

    const blogsObject = initialBlogs.map(blog => new Blog(blog))
    const promises = blogsObject.map(blog => blog.save())
    await Promise.all(promises)// Si es importante que el orden de los elementos se respete habría que recurrir a un for of en lugar de al Promise.all()
  })

  test('are returned as json, got 200', async () => {
    await api.get('/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all in database', async () => {
    const { response } = await getFromBlogs()
    expect(response.body).toHaveLength(initialBlogs.length)
  })

  test(`contains title "${initialBlogs[0].title}"`, async () => {
    const response = await getFromBlogs()
    const titles = response.titles()

    expect(titles).toContain(`${initialBlogs[0].title}`)
  })

  test(`contains author "${initialBlogs[1].author}"`, async () => {
    const response = await getFromBlogs()
    const authors = response.authors()

    expect(authors).toContain(`${initialBlogs[1].author}`)
  })

  test('add a new valid blog', async () => {
    const newBlog = initialBlogs[2]

    await api
      .post('/blogs')
      .send(newBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const response = await getFromBlogs()
    const bodies = response.bodies()

    expect(bodies).toContain(newBlog.body)
    expect(bodies).toHaveLength(initialBlogs.length + 1)
  })

  test('returns 400 with an invalid blog', async () => {
    const newBlog = {
      title: 'Este blog no tiene body ni autor.'
    }

    await api
      .post('/blogs')
      .send(newBlog)
      .expect(400)
      .expect('Content-Type', /application\/json/)
      .expect({ error: 'Something is missing' })
  })

  test('properly remove an existing blog', async () => {
    const response = await getFromBlogs()
    const ids = response.ids()
    const firstId = ids[0]

    await api
      .delete(`/blogs/${firstId}`)
      .expect(204)

    const newResponse = await getFromBlogs()
    const newIds = newResponse.ids()

    expect(newIds).toHaveLength(ids.length - 1)
    expect(newIds).not.toContain(firstId)
  })

  test('handles the attempt to remove a non-existent blog', async () => {
    const response = await getFromBlogs()
    const ids = response.ids()

    await api
      .delete('/blogs/not-an-id')
      .expect(400)
      .expect({ error: 'Used id is malformed' })

    const newResponse = await getFromBlogs()
    const newIds = newResponse.ids()

    expect(newIds).toHaveLength(ids.length)
  })

  afterAll(async () => {
    await mongoose.connection.close()
  })
})
