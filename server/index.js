const express = require('express')
const http = require('http')
const cors = require('cors')
const { Server } = require('socket.io')
const { v4: uuidv4 } = require('uuid')

const db = require('./database')

const app = express()
const server = http.createServer(app)

const io = new Server(server, {
  cors: { origin: '*' }
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

  db.run(
    `INSERT INTO calls (table_number, status) VALUES (?, ?)`,
    [table, 'waiting']
  )

  io.emit('new_call', {
    table,
    status: 'waiting',
    createdAt: Date.now()
  })

  res.json({ success: true })
})

app.post('/accept', (req, res) => {
  const { table } = req.body

  db.run(
    `
    UPDATE calls
    SET status='accepted',
        accepted_at=CURRENT_TIMESTAMP
    WHERE id=(
      SELECT id
      FROM calls
      WHERE table_number=?
      ORDER BY id DESC
      LIMIT 1
    )
    `,
    [table]
  )

  io.emit('call_accepted', { table })

  res.json({ success: true })
})

app.post('/complete', (req, res) => {
  const { table } = req.body

  db.run(
    `
    UPDATE calls
    SET status='completed',
        completed_at=CURRENT_TIMESTAMP
    WHERE id=(
      SELECT id
      FROM calls
      WHERE table_number=?
      ORDER BY id DESC
      LIMIT 1
    )
    `,
    [table]
  )

  io.emit('call_completed', { table })

  res.json({ success: true })
})

app.get('/admin/calls', (req, res) => {
  db.all(
    `SELECT * FROM calls ORDER BY id DESC`,
    [],
    (err, rows) => {
      if (err) {
        return res.status(500).json(err)
      }

      res.json(rows)
    }
  )
})

server.listen(3000, () => {
  console.log('Server started on 3000')
})