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

  afterAll(async () => {
    await mongoose.connection.close()
  })
})
