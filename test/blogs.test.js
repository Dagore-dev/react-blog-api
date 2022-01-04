const { server } = require('../index')
const mongoose = require('mongoose')
const Blog = require('../models/Blog')
const {
  initialBlogs,
  api,
  getAllFromBlogs,
  getTitlesFromBlog,
  getBodiesFromBlogs,
  getAuthorsFromBlogs
} = require('./helpers')

describe('blogs', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})// Antes de los test elimina todas las notas del entorno de testing.

    const blog1 = new Blog(initialBlogs[0])
    await blog1.save()

    const blog2 = new Blog(initialBlogs[1])
    await blog2.save()
  })

  test('are returned as json, got 200', async () => {
    api.get('/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('are two', async () => {
    const { response } = await getAllFromBlogs()
    expect(response.body).toHaveLength(initialBlogs.length - 1)
  })

  test(`contains title "${initialBlogs[0].title}"`, async () => {
    const titles = await getTitlesFromBlog()

    expect(titles).toContain(`${initialBlogs[0].title}`)
  })

  test(`contains author "${initialBlogs[1].author}"`, async () => {
    const authors = await getAuthorsFromBlogs()

    expect(authors).toContain(`${initialBlogs[1].author}`)
  })

  test('add a new valid blog', async () => {
    const newBlog = initialBlogs[2]

    await api
      .post('/blogs')
      .send(newBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const bodies = await getBodiesFromBlogs()

    expect(bodies).toContain(newBlog.body)
    expect(bodies).toHaveLength(3)
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

  afterAll(() => {
    mongoose.connection.close()
    server.close()
  })
})
