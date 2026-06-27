import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

const MOCK_USERS = [
  { id: 1, username: 'user', role: 'user', audits: 3, lastActive: '2024-01-15' },
  { id: 2, username: 'admin1', role: 'admin', audits: 12, lastActive: '2024-01-16' },
]

const MOCK_AUDITS = [
  { id: 1, user: 'user', file: 'hospital_bill.pdf', savings: 16200, flags: 3, date: '2024-01-15' },
  { id: 2, user: 'user', file: 'bill2.pdf', savings: 4500, flags: 1, date: '2024-01-14' },
  { id: 3, user: 'admin1', file: 'test_bill.pdf', savings: 8900, flags: 5, date: '2024-01-13' },
]

export default function AdminPage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div style={{ maxWidth: 900, margin: '40px auto', padding: '0 20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 600 }}>Admin Panel</h1>
          <p style={{ fontSize: 13, color: '#888' }}>Logged in as {user?.username}</p>
        </div>
        <button
          onClick={handleLogout}
          style={{ fontSize: 13, padding: '8px 16px', border: '1px solid #ddd', borderRadius: 8, cursor: 'pointer', background: '#fff' }}
        >
          Logout
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12, marginBottom: 28 }}>
        {[
          { label: 'Total users', value: MOCK_USERS.length },
          { label: 'Total audits', value: MOCK_AUDITS.length },
          { label: 'Total savings found', value: `₹${MOCK_AUDITS.reduce((a, b) => a + b.savings, 0).toLocaleString()}` },
          { label: 'Avg flags per audit', value: (MOCK_AUDITS.reduce((a, b) => a + b.flags, 0) / MOCK_AUDITS.length).toFixed(1) },
        ].map(c => (
          <div key={c.label} style={{ background: '#fff', border: '1px solid #eee', borderRadius: 10, padding: '14px 16px' }}>
            <p style={{ fontSize: 12, color: '#888', marginBottom: 4 }}>{c.label}</p>
            <p style={{ fontSize: 22, fontWeight: 600 }}>{c.value}</p>
          </div>
        ))}
      </div>

      {/* Users table */}
      <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>Users</h2>
      <div style={{ background: '#fff', border: '1px solid #eee', borderRadius: 10, overflow: 'hidden', marginBottom: 28 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f9fafb' }}>
              {['Username', 'Role', 'Audits done', 'Last active'].map(h => (
                <th key={h} style={{ padding: '10px 14px', fontSize: 12, color: '#888', textAlign: 'left', fontWeight: 500 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {MOCK_USERS.map(u => (
              <tr key={u.id} style={{ borderTop: '1px solid #f0f0f0' }}>
                <td style={{ padding: '10px 14px', fontSize: 13 }}>{u.username}</td>
                <td style={{ padding: '10px 14px', fontSize: 13 }}>
                  <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 4, background: u.role === 'admin' ? '#ede9fe' : '#dcfce7', color: u.role === 'admin' ? '#6d28d9' : '#16a34a' }}>
                    {u.role}
                  </span>
                </td>
                <td style={{ padding: '10px 14px', fontSize: 13 }}>{u.audits}</td>
                <td style={{ padding: '10px 14px', fontSize: 13, color: '#888' }}>{u.lastActive}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Audits table */}
      <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>Recent audits</h2>
      <div style={{ background: '#fff', border: '1px solid #eee', borderRadius: 10, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f9fafb' }}>
              {['User', 'File', 'Savings found', 'Flags', 'Date'].map(h => (
                <th key={h} style={{ padding: '10px 14px', fontSize: 12, color: '#888', textAlign: 'left', fontWeight: 500 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {MOCK_AUDITS.map(a => (
              <tr key={a.id} style={{ borderTop: '1px solid #f0f0f0' }}>
                <td style={{ padding: '10px 14px', fontSize: 13 }}>{a.user}</td>
                <td style={{ padding: '10px 14px', fontSize: 13 }}>{a.file}</td>
                <td style={{ padding: '10px 14px', fontSize: 13, color: '#16a34a' }}>₹{a.savings.toLocaleString()}</td>
                <td style={{ padding: '10px 14px', fontSize: 13 }}>{a.flags}</td>
                <td style={{ padding: '10px 14px', fontSize: 13, color: '#888' }}>{a.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}