const { app, server } = require('../index')
const mongoose = require('mongoose')
const supertest = require('supertest')
const api = supertest(app)
const Blog = require('../models/Blog')
const initialBlogs = [
  {
    title: 'Creada con mongoose',
    body: 'Este post está creado siguiendo un esquema a nivel de aplicación. Además lo he modificado con un put.',
    author: 'Dagore',
    id: '61c9cbe12091b4a48faf24d0'
  },
  {
    title: 'Esto es un blog creado por un POST',
    body: 'Aliquam sit amet suscipit urna, eget consequat purus. Donec dolor enim, tincidunt et metus id, auctor faucibus velit. Aliquam pharetra neque id lorem commodo, eu auctor ante commodo. Vivamus ut lacus dictum, malesuada erat et, posuere libero. Fusce accumsan aliquam sodales. Curabitur id nunc pharetra, molestie neque id, lobortis risus. Ut mattis, augue non semper hendrerit, ligula nisi placerat lacus, eu laoreet dui ante eget turpis. Etiam convallis, purus a hendrerit consequat, mauris justo dignissim neque, sit amet sollicitudin lectus mi in urna. Etiam vestibulum eros augue, in viverra sapien aliquet nec. Ut vulputate arcu sed purus sollicitudin, vitae varius erat ullamcorper. Nam porta feugiat eros, eu ornare lorem pharetra vel.',
    author: 'Dagore',
    id: '61c9f85ada8c99d41738cb5a'
  },
  {
    title: 'Probando',
    body: '123 123',
    author: 'usuario',
    id: '61d013c4fa2cb555535ddca1'
  }
]

describe('blogs', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})// Antes de los test elimina todas las notas del entorno de testing.

    const blog1 = new Blog(initialBlogs[0])
    await blog1.save()

    const blog2 = new Blog(initialBlogs[1])
    await blog2.save()
  })

  test('are returned as json, got 200', async () => {
    await api
      .get('/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('are two', async () => {
    const res = await api.get('/blogs')
    expect(res.body).toHaveLength(initialBlogs.length - 1)
  })

  test(`contains title "${initialBlogs[0].title}"`, async () => {
    const res = await api.get('/blogs')
    const content = res.body.map(blog => blog.title)

    expect(content).toContain(`${initialBlogs[0].title}`)
  })

  test(`contains author "${initialBlogs[1].author}"`, async () => {
    const res = await api.get('/blogs')
    const content = res.body.map(blog => blog.author)

    expect(content).toContain(`${initialBlogs[1].author}`)
  })

  afterAll(() => {
    mongoose.connection.close()
    server.close()
  })
})
