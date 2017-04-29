// const http = require('http')
const SocketServer = require('socket.io')
const cfg = require('./config')
// const httpHandler = require('./app/static/httpHandler')
const onConnection = require('./app/onConnection')

// TODO: static server; For admin/monitor interface
// const app = http.createServer(httpHandler)
// app.listen(cfg.port, cfg.domain)

const io = new SocketServer(cfg.port)

io.on('connect', onConnection)

console.log('\n🌐  Sockets open and ready for use ::')
