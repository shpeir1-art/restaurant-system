import { useEffect, useState } from 'react'
import axios from 'axios'
import { socket } from '../socket'

const API_URL = 'https://restaurant-system-production-3d31.up.railway.app'

export default function WaiterPage() {
const [calls, setCalls] = useState([])

useEffect(() => {
socket.on('new_call', data => {
const audio = new Audio(
'https://actions.google.com/sounds/v1/alarms/beep_short.ogg'
)

```
  audio.play().catch(() => {})

  setCalls(prev => [
    {
      ...data,
      createdAt: new Date().toLocaleTimeString()
    },
    ...prev
  ])
})
```

}, [])

const acceptCall = async table => {
await axios.post(`${API_URL}/accept`, { table })

```
setCalls(prev =>
  prev.map(c =>
    c.table === table
      ? { ...c, status: 'accepted' }
      : c
  )
)
```

}

const completeCall = async table => {
await axios.post(`${API_URL}/complete`, { table })

```
setCalls(prev =>
  prev.filter(c => c.table !== table)
)
```

}

return (
<div
style={{
minHeight: '100vh',
background: '#f3f4f6',
padding: 20,
fontFamily: 'Arial'
}}
>
<h1
style={{
textAlign: 'center',
marginBottom: 30
}}
>
🍽 Панель официанта </h1>

```
  {calls.length === 0 && (
    <div
      style={{
        textAlign: 'center',
        color: '#666',
        marginTop: 100,
        fontSize: 24
      }}
    >
      Вызовов нет
    </div>
  )}

  {calls.map(call => (
    <div
      key={call.table}
      style={{
        background: '#fff',
        borderRadius: 20,
        padding: 25,
        marginBottom: 20,
        boxShadow:
          '0 10px 30px rgba(0,0,0,.12)'
      }}
    >
      <h2>🍽 Стол #{call.table}</h2>

      <div
        style={{
          marginBottom: 10,
          color: '#666'
        }}
      >
        Вызов: {call.createdAt}
      </div>

      <p
        style={{
          fontSize: 22,
          fontWeight: 'bold'
        }}
      >
        {call.status === 'waiting' &&
          '🔴 Ожидает'}

        {call.status === 'accepted' &&
          '🟡 Уже иду'}
      </p>

      {call.status === 'waiting' && (
        <button
          onClick={() =>
            acceptCall(call.table)
          }
          style={{
            background: '#f59e0b',
            color: '#fff',
            border: 'none',
            borderRadius: 12,
            padding: '14px 25px',
            marginRight: 10,
            fontSize: 18,
            fontWeight: 'bold',
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
          background: '#10b981',
          color: '#fff',
          border: 'none',
          borderRadius: 12,
          padding: '14px 25px',
          fontSize: 18,
          fontWeight: 'bold',
          cursor: 'pointer'
        }}
      >
        Завершить
      </button>
    </div>
  ))}
</div>
```

)
}
