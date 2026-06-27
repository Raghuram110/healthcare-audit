import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleLogin = () => {
    if (!username || !password) return setError('Enter username and password')
    const result = login(username, password)
    if (result.success) {
      if (result.role === 'admin') navigate('/admin')
      else navigate('/')
    } else {
      setError('Invalid username or password')
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#f5f5f5'
    }}>
      <div style={{
        background: '#fff',
        borderRadius: 16,
        padding: '40px 36px',
        width: '100%',
        maxWidth: 380,
        boxShadow: '0 4px 24px rgba(0,0,0,0.08)'
      }}>
        <h1 style={{ fontSize: 22, fontWeight: 600, marginBottom: 6 }}>
          Healthcare Audit
        </h1>
        <p style={{ fontSize: 13, color: '#888', marginBottom: 28 }}>
          Sign in to continue
        </p>

        <div style={{ marginBottom: 12 }}>
          <label style={{ fontSize: 12, color: '#666', display: 'block', marginBottom: 6 }}>
            Username
          </label>
          <input
            type="text"
            placeholder="Enter username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
            style={{
              width: '100%',
              padding: '10px 12px',
              border: '1px solid #ddd',
              borderRadius: 8,
              fontSize: 14,
              outline: 'none'
            }}
          />
        </div>

        <div style={{ marginBottom: 20 }}>
          <label style={{ fontSize: 12, color: '#666', display: 'block', marginBottom: 6 }}>
            Password
          </label>
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
            style={{
              width: '100%',
              padding: '10px 12px',
              border: '1px solid #ddd',
              borderRadius: 8,
              fontSize: 14,
              outline: 'none'
            }}
          />
        </div>

        {error && (
          <p style={{ color: '#e53e3e', fontSize: 12, marginBottom: 12 }}>
            {error}
          </p>
        )}

        <button
          onClick={handleLogin}
          style={{
            width: '100%',
            padding: '11px',
            background: '#4f46e5',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            fontSize: 14,
            cursor: 'pointer'
          }}
        >
          Sign in
        </button>

        <div style={{ marginTop: 20, padding: 12, background: '#f9fafb', borderRadius: 8, fontSize: 11, color: '#888' }}>
          <p style={{ marginBottom: 4 }}><strong>User login:</strong> user / user123</p>
          <p><strong>Admin login:</strong> admin1 / admin123</p>
        </div>
      </div>
    </div>
  )
}