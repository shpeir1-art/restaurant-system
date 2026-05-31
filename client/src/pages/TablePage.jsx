import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { socket } from '../socket'

const API_URL = 'https://restaurant-system-production-3d31.up.railway.app'

export default function TablePage() {
  const { id } = useParams()

  const [sessionId, setSessionId] = useState('')
  const [status, setStatus] = useState('')

  useEffect(() => {
    axios.post(`${API_URL}/session/${id}`)
      .then(res => setSessionId(res.data.sessionId))

    socket.on('call_accepted', data => {
      if (String(data.table) === String(id)) {
        setStatus('accepted')
      }
    })

    socket.on('call_completed', data => {
      if (String(data.table) === String(id)) {
        setStatus('completed')
      }
    })
  }, [])

  const callWaiter = async () => {
    navigator.vibrate?.([300, 100, 300])

    await axios.post(`${API_URL}/call`, {
      table: id,
      sessionId
    })

    setStatus('waiting')
  }

  return (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background:
          'linear-gradient(135deg,#0f172a,#1e293b,#334155)',
        color: '#fff',
        fontFamily: 'Arial'
      }}
    >
      <div
        style={{
          width: '90%',
          maxWidth: 500,
          textAlign: 'center',
          background: 'rgba(255,255,255,0.08)',
          backdropFilter: 'blur(10px)',
          borderRadius: 30,
          padding: 40
        }}
      >
        <div style={{ fontSize: 70 }}>🍽️</div>

        <h2>Добро пожаловать</h2>

        <h1
          style={{
            fontSize: 42,
            marginBottom: 30
          }}
        >
          Стол №{id}
        </h1>

        <button
          onClick={callWaiter}
          disabled={
            status === 'waiting' ||
            status === 'accepted'
          }
          style={{
            width: '100%',
            padding: 25,
            border: 'none',
            borderRadius: 100,
            fontSize: 24,
            color: '#fff',
            cursor: 'pointer',
            background:
              status === ''
                ? '#ef4444'
                : '#22c55e'
          }}
        >
          {status === ''
            ? 'НАЖМИТЕ ДЛЯ ВЫЗОВА ОФИЦИАНТА'
            : 'ОФИЦИАНТ ВЫЗВАН'}
        </button>

        <div
          style={{
            marginTop: 35,
            fontSize: 24
          }}
        >
          {status === '' &&
            '👆 Нажмите кнопку для вызова'}

          {status === 'waiting' &&
            '⏳ Официант уведомлен'}

          {status === 'accepted' &&
            '🚶 Официант уже идёт'}

          {status === 'completed' &&
            '✅ Официант подошёл'}
        </div>
      </div>
    </div>
  )
}