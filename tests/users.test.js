const mongoose = require('mongoose')
const User = require('../models/User')
const bcrypt = require('bcrypt')
const {
  api,
  getFromUsers
} = require('./helpers/getFromUsers')

describe('users', () => {
  beforeEach(async () => {
    await User.deleteMany({})
    const passwordHash = await bcrypt.hash('password', 10)
    const newUser = new User({
      username: 'Dagore94',
      name: 'David',
      passwordHash
    })
    await newUser.save()
  })

  test('are returned as json, got 200', async () => {
    await api.get('/users')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('have only one stored', async () => {
    const { response } = await getFromUsers()
    expect(response.body).toHaveLength(1)
  })

  test('create new valid user', async () => {
    const newUser = {
      username: 'Dagore',
      name: 'David Gómez',
      password: 'qwert'
    }

    await api
      .post('/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const get = await getFromUsers()
    expect(get.response.body).toHaveLength(2)
    expect(get.usernames()).toContain(newUser.username)
    expect(get.names()).toContain(newUser.name)
  })

  test('creation fails if username if already in use', async () => {
    const newUser1 = {
      username: 'Dagore',
      name: 'David Gómez',
      password: '123123'
    }

    const newUser2 = {
      username: 'Dagore',
      name: 'David Gómez',
      password: '123123'
    }

    await api
      .post('/users')
      .send(newUser1)

    await api
      .post('/users')
      .send(newUser2)
      .expect('Content-Type', /application\/json/)
      .expect(/Error, expected `username` to be unique./)

    const get = await getFromUsers()
    const usernames = get.usernames().filter(username => username === newUser1.username)
    expect(usernames).toHaveLength(1)
  })

  afterAll(async () => {
    await mongoose.connection.close()
  })
})
