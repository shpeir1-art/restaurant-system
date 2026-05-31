
const express = require('express')
const http = require('http')
const cors = require('cors')
const { Server } = require('socket.io')
const { v4: uuidv4 } = require('uuid')

const app = express()
const server = http.createServer(app)

const io = new Server(server, {
  cors: { origin: "*" }
})

app.use(cors())
app.use(express.json())

const sessions = {}

app.post('/session/:table', (req, res) => {
  const table = req.params.table

  const sessionId = uuidv4()

  sessions[table] = {
    sessionId,
    expires: Date.now() + 1000 * 60 * 90
  }

  res.json({ sessionId })
})

app.post('/call', (req, res) => {
  const { table, sessionId } = req.body

  const session = sessions[table]

  if (!session || session.sessionId !== sessionId) {
    return res.status(403).json({ error: 'invalid session' })
  }

  io.emit('new_call', {
    table,
    status: 'waiting'
  })

  res.json({ success: true })
})

app.post('/accept', (req, res) => {
  io.emit('call_accepted', req.body)
  res.json({ success: true })
})

app.post('/complete', (req, res) => {
  io.emit('call_completed', req.body)
  res.json({ success: true })
})

server.listen(3000, () => {
  console.log('Server started on 3000')
})
