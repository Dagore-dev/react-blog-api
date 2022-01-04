const { server } = require('../../index')
const supertest = require('supertest')
const api = supertest(server)

async function getFromBlogs () {
  const response = await api.get('/blogs')
  const body = response.body

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
    titles,
    bodies,
    authors
  }
}

module.exports = {
  api,
  getFromBlogs
}
