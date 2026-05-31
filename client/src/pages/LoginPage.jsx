import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function LoginPage() {
  const [name, setName] = useState('')
  const navigate = useNavigate()

  const login = () => {
    if (!name) return

    localStorage.setItem('waiterName', name)

    navigate('/waiter')
  }

  return (
    <div
      style={{
        height:'100vh',
        display:'flex',
        justifyContent:'center',
        alignItems:'center',
        background:'#0f172a',
        color:'#fff'
      }}
    >
      <div
        style={{
          background:'#1e293b',
          padding:40,
          borderRadius:20,
          width:400
        }}
      >
        <h1>Вход официанта</h1>

        <input
          value={name}
          onChange={e=>setName(e.target.value)}
          placeholder='Введите имя'
          style={{
            width:'100%',
            padding:15,
            fontSize:18,
            marginTop:20,
            borderRadius:10
          }}
        />

        <button
          onClick={login}
          style={{
            width:'100%',
            marginTop:20,
            padding:15,
            border:'none',
            borderRadius:10,
            background:'#22c55e',
            color:'#fff',
            fontSize:18
          }}
        >
          Начать работу
        </button>
      </div>
    </div>
  )
}