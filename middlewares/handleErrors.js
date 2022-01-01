module.exports = (error, req, res, next) => {
  console.error(error)
  if (error.name === 'CastError') {
    res.status(400).send({ error: 'Used id is malformed' })
  } else {
    res.status(500).end()
  }
}
