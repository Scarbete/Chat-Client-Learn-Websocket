const express = require('express')
const http = require('http')
const cors = require('cors')
const { Server } = require('socket.io')

const app = express()
app.use(cors())

const server = http.createServer(app)

const io = new Server(server, {
    cors: {
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST'],
    },
})

io.on('connection', (socket) => {
    socket.on('send_message', (data) => io.emit('receive_message', data))
    socket.on('disconnect', () => console.log(`User disconnected: ${socket.id}`))
})

server.listen(4000, () => console.log('Server is running on port 4000'))