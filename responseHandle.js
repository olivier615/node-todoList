const header = require('./header.js')

function successHandel(response, todos) {
  response.writeHead(200, header)
  response.write(JSON.stringify({
      'statue': 'success',
      'data':todos
  }))
  response.end()
}

function errorHandle(response, statueCode, message) {
  response.writeHead(statueCode, header)
  response.write(JSON.stringify({
    'statue': 'false',
    'message': message
  }))
  response.end()
}

module.exports = {
  successHandel,
  errorHandle
}