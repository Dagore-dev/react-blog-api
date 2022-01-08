const usersRouter = require('express').Router()
const User = require('../models/User')
const bcrypt = require('bcrypt')

usersRouter.get('/', async (request, response) => {
  const users = await User.find({})
  response.json(users)
})

usersRouter.post('/', async (request, response) => { // la ruta que se tiene que indicar aquí es la parte a lo que encontramos en el app.use() en el index.
  const { username, name, password } = request.body
  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)// El número es un valor que hace referencia al coste computacional que queremos invertir en el hash.

  const user = new User({
    username,
    name,
    passwordHash
  })

  try {
    const savedUser = await user.save()
    response.status(201).json(savedUser)
  } catch (err) {
    response.json(err)
  }
})

usersRouter.put('/:id', async (request, response, next) => {
  const id = request.params.id
  const { username, name, blogs } = request.body

  const newUserInfo = {
    username,
    name,
    blogs
  }

  User.findByIdAndUpdate(id, newUserInfo, { new: true })
    .then(user => {
      response.json(user)
    })
    .catch(err => {
      next(err)
    })
})

module.exports = usersRouter
