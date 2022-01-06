function logger (req, res, next) {
  console.log(req.method)
  console.log(req.path)
  console.log(req.body)
  console.log('-------')
  next()// Cuando no se envía respuesta hay que indicar imperativamente que continue ejecutando el siguiente método de app.
}

module.exports = logger
