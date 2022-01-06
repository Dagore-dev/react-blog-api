const { app } = require('../../index')
const supertest = require('supertest')
const api = supertest(app)

async function getFromUsers () {
  const response = await api.get('/users')
  const body = response.body

  function usernames () {
    return body.map(user => user.username)
  }

  function names () {
    return body.map(user => user.name)
  }

  function blogs () {
    return body.map(user => user.blogs)
  }

  return {
    response,
    usernames,
    names,
    blogs
  }
}

module.exports = { api, getFromUsers }
