import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import { YSocketIO } from 'y-socket.io/dist/server'

const app = express()
app.use(express.static('public'))
const httpServer = createServer(app)

const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
})

const ysocket = new YSocketIO(io)

ysocket.initialize()

app.get('/test', (req, res) => {
  res.send('Hello from test route!')
})

httpServer.listen(3000, () => {
  console.log('Server running at http://localhost:3000')
})