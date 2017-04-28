const http = require('http')
const SocketServer = require('socket.io')
const cfg = require('./config')
const httpHandler = require('./static/httpHandler')
const onConnection = require('./app/onConnection')

const app = http.createServer(httpHandler)
app.listen(cfg.port, cfg.domain)

const io = new SocketServer(app)

io.of('/sensor').on('connect', onConnection)
io.of('/monitor').on('connect', onConnection)

console.log('\n🌐  Sockets open and ready for use ::')
