const { app } = require('../index')
const supertest = require('supertest')
const api = supertest(app)

const initialBlogs = [
  {
    title: 'Creada con mongoose',
    body: 'Este post está creado siguiendo un esquema a nivel de aplicación. Además lo he modificado con un put.',
    author: 'Dagore'
  },
  {
    title: 'Esto es un blog creado por un POST',
    body: 'Aliquam sit amet suscipit urna, eget consequat purus. Donec dolor enim, tincidunt et metus id, auctor faucibus velit. Aliquam pharetra neque id lorem commodo, eu auctor ante commodo. Vivamus ut lacus dictum, malesuada erat et, posuere libero. Fusce accumsan aliquam sodales. Curabitur id nunc pharetra, molestie neque id, lobortis risus. Ut mattis, augue non semper hendrerit, ligula nisi placerat lacus, eu laoreet dui ante eget turpis. Etiam convallis, purus a hendrerit consequat, mauris justo dignissim neque, sit amet sollicitudin lectus mi in urna. Etiam vestibulum eros augue, in viverra sapien aliquet nec. Ut vulputate arcu sed purus sollicitudin, vitae varius erat ullamcorper. Nam porta feugiat eros, eu ornare lorem pharetra vel.',
    author: 'Dagore'
  },
  {
    title: 'Probando',
    body: '123 123',
    author: 'usuario'
  }
]

function getBlogs () {
  return api.get('/blogs')
}

async function getAllFromBlogs () {
  const response = await getBlogs()

  const titles = response.body.map(blog => blog.title)
  const bodies = response.body.map(blog => blog.body)
  const authors = response.body.map(blog => blog.author)

  return {
    response,
    titles,
    bodies,
    authors
  }
}

async function getTitlesFromBlog () {
  const { body } = await getBlogs()
  return body.map(blog => blog.title)
}

async function getBodiesFromBlogs () {
  const { body } = await getBlogs()
  return body.map(blog => blog.body)
}

async function getAuthorsFromBlogs () {
  const { body } = await getBlogs()
  return body.map(blog => blog.author)
}

module.exports = {
  initialBlogs,
  api,
  getBlogs,
  getAllFromBlogs,
  getTitlesFromBlog,
  getBodiesFromBlogs,
  getAuthorsFromBlogs
}
