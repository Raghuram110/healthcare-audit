import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

const USERS = [
  { username: 'admin1', password: 'admin123', role: 'admin' },
  { username: 'admin2', password: 'admin123', role: 'admin' },
  { username: 'user', password: 'user123', role: 'user' },
]

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('auth_user')
    return saved ? JSON.parse(saved) : null
  })

  const login = (username, password) => {
    const found = USERS.find(
      u => u.username === username && u.password === password
    )
    if (found) {
      const userData = { username: found.username, role: found.role }
      localStorage.setItem('auth_user', JSON.stringify(userData))
      setUser(userData)
      return { success: true, role: found.role }
    }
    return { success: false }
  }

  const logout = () => {
    localStorage.removeItem('auth_user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)