const { app } = require('../../index')
const supertest = require('supertest')
const api = supertest(app)

async function getFromBlogs () {
  const response = await api.get('/blogs')
  const body = response.body

  function ids () {
    return body.map(blog => blog.id)
  }

  function titles () {
    return body.map(blog => blog.title)
  }

  function bodies () {
    return body.map(blog => blog.body)
  }

  function authors () {
    return body.map(blog => blog.author)
  }

  return {
    response,
    ids,
    titles,
    bodies,
    authors
  }
}

module.exports = {
  api,
  getFromBlogs
}
