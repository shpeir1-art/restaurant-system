import { useEffect, useState } from 'react'
import axios from 'axios'
import { socket } from '../socket'

const API_URL = 'https://restaurant-system-production-3d31.up.railway.app'

export default function WaiterPage() {
  const [calls, setCalls] = useState([])

  useEffect(() => {
    socket.on('new_call', data => {
      setCalls(prev => [...prev, data])

      try {
        const audio = new Audio(
          'https://actions.google.com/sounds/v1/alarms/beep_short.ogg'
        )
        audio.play()
      } catch {}
    })

    return () => {
      socket.off('new_call')
    }
  }, [])

  const acceptCall = async table => {
    await axios.post(`${API_URL}/accept`, { table })

    setCalls(prev =>
      prev.map(c =>
        c.table === table
          ? {
              ...c,
              status: 'accepted',
              acceptedAt: Date.now()
            }
          : c
      )
    )
  }

  const completeCall = async table => {
    await axios.post(`${API_URL}/complete`, { table })

    setCalls(prev =>
      prev.filter(c => c.table !== table)
    )
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        padding: 30,
        background:
          'linear-gradient(135deg,#0f172a,#1e293b)',
        fontFamily: 'Arial',
        color: '#fff'
      }}
    >
      <h1
        style={{
          marginBottom: 30
        }}
      >
        🍽 Панель официанта
      </h1>

      {calls.length === 0 && (
        <div
          style={{
            background: '#1e293b',
            padding: 40,
            borderRadius: 25,
            textAlign: 'center'
          }}
        >
          Нет активных вызовов
        </div>
      )}

      {calls.map(call => (
        <div
          key={call.table}
          style={{
            background:
              call.status === 'waiting'
                ? '#7f1d1d'
                : '#14532d',
            borderRadius: 25,
            padding: 25,
            marginBottom: 20,
            boxShadow:
              '0 10px 30px rgba(0,0,0,.3)'
          }}
        >
          <h2
            style={{
              fontSize: 32
            }}
          >
            Стол №{call.table}
          </h2>

          <div
            style={{
              fontSize: 22,
              marginTop: 10,
              marginBottom: 20
            }}
          >
            {call.status === 'waiting' &&
              '🔴 Ожидает официанта'}

            {call.status === 'accepted' &&
              '🟢 Уже иду'}
          </div>

          {call.status === 'waiting' && (
            <button
              onClick={() =>
                acceptCall(call.table)
              }
              style={{
                background: '#f59e0b',
                border: 'none',
                color: '#fff',
                padding: '15px 25px',
                borderRadius: 15,
                fontSize: 18,
                marginRight: 10,
                cursor: 'pointer'
              }}
            >
              Подойду
            </button>
          )}

          <button
            onClick={() =>
              completeCall(call.table)
            }
            style={{
              background: '#22c55e',
              border: 'none',
              color: '#fff',
              padding: '15px 25px',
              borderRadius: 15,
              fontSize: 18,
              cursor: 'pointer'
            }}
          >
            Завершить
          </button>
        </div>
      ))}
    </div>
  )
}
