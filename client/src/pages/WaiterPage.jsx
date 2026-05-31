
import { useEffect, useState } from 'react'
import axios from 'axios'
import { socket } from '../socket'

export default function WaiterPage() {
  const [calls, setCalls] = useState([])

  useEffect(() => {
    socket.on('new_call', data => {
      alert(`Стол ${data.table} вызывает официанта`)

      setCalls(prev => [...prev, data])
    })
  }, [])

  const acceptCall = async table => {
    await axios.post('http://localhost:3000/accept', { table })

    setCalls(prev =>
      prev.map(c =>
        c.table === table
          ? { ...c, status: 'accepted' }
          : c
      )
    )
  }

  const completeCall = async table => {
    await axios.post('http://localhost:3000/complete', { table })

    setCalls(prev => prev.filter(c => c.table !== table))
  }

  return (
    <div style={{
      padding:30,
      background:'#f5f5f5',
      minHeight:'100vh',
      fontFamily:'Arial'
    }}>
      <h1>Панель официанта</h1>

      {calls.map(call => (
        <div
          key={call.table}
          style={{
            background:'#fff',
            padding:25,
            borderRadius:20,
            marginBottom:20,
            border:'4px solid red'
          }}
        >
          <h2>Стол #{call.table}</h2>

          <p style={{fontSize:22}}>
            {call.status === 'waiting' && '🔴 Ожидает'}
            {call.status === 'accepted' && '🟡 Уже идёт'}
          </p>

          {call.status === 'waiting' && (
            <button
              onClick={() => acceptCall(call.table)}
              style={{
                padding:'15px 25px',
                marginRight:10,
                border:'none',
                borderRadius:12,
                background:'#ffd54f',
                fontSize:18
              }}
            >
              Подойду
            </button>
          )}

          <button
            onClick={() => completeCall(call.table)}
            style={{
              padding:'15px 25px',
              border:'none',
              borderRadius:12,
              background:'#81c784',
              fontSize:18
            }}
          >
            Завершить
          </button>
        </div>
      ))}
    </div>
  )
}
