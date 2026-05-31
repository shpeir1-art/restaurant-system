
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
    await axios.post(`${API_URL}/call`, {
      table: id,
      sessionId
    })

    setStatus('waiting')
  }

  return (
    <div style={{
      height:'100vh',
      display:'flex',
      flexDirection:'column',
      justifyContent:'center',
      alignItems:'center',
      background:'#ffffff',
      fontFamily:'Arial'
    }}>
      <h1 style={{fontSize:50}}>Стол #{id}</h1>

      <button
        onClick={callWaiter}
        disabled={status === 'waiting' || status === 'accepted'}
        style={{
          background:'#ff4d4d',
          color:'#fff',
          border:'none',
          borderRadius:30,
          padding:'30px 60px',
          fontSize:30,
          cursor:'pointer'
        }}
      >
        ПОЗВАТЬ ОФИЦИАНТА
      </button>

      <div style={{marginTop:40,fontSize:28}}>
        {status === 'waiting' && '🔔 Официант вызван'}
        {status === 'accepted' && '👨‍🍳 Официант уже идёт'}
        {status === 'completed' && '✅ Вызов завершён'}
      </div>
    </div>
  )
}
