import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const API = 'http://127.0.0.1:8000'

const DOC_TYPES = [
  'hospital_bill',
  'insurance_policy',
  'discharge_summary',
  'prescription',
  'lab_report',
  'pharmacy_bill'
]

export default function UploadPage() {
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const onDrop = useCallback(accepted => {
    setFiles(prev => [...prev, ...accepted])
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index))
  }

  const analyze = async () => {
    if (!files.length) return setError('Please upload at least one file')
    setLoading(true)
    setError('')
    try {
      const form = new FormData()
      files.forEach(f => form.append('files', f))
      const res = await axios.post(`${API}/upload-and-analyze`, form)
      navigate('/results', { state: { result: res.data } })
    } catch (e) {
      setError('Analysis failed. Make sure the API server is running.')
    }
    setLoading(false)
  }

  return (
    <div style={{ maxWidth: 680, margin: '40px auto', padding: '0 20px' }}>
      <h1 style={{ fontSize: 24, fontWeight: 600, marginBottom: 8 }}>
        Healthcare Bill Audit
      </h1>
      <p style={{ color: '#666', marginBottom: 24 }}>
        Upload your hospital documents to detect overcharges and check insurance coverage.
      </p>

      <div style={{ marginBottom: 16 }}>
        <p style={{ fontSize: 13, color: '#888', marginBottom: 8 }}>Accepted documents:</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {DOC_TYPES.map(t => (
            <span key={t} style={{ fontSize: 11, padding: '2px 8px', border: '1px solid #ddd', borderRadius: 4, color: '#555' }}>
              {t.replace(/_/g, ' ')}
            </span>
          ))}
        </div>
      </div>

      <div
        {...getRootProps()}
        style={{
          border: `2px dashed ${isDragActive ? '#4f46e5' : '#ddd'}`,
          borderRadius: 12,
          padding: 40,
          textAlign: 'center',
          cursor: 'pointer',
          background: isDragActive ? '#eef2ff' : '#fff',
          marginBottom: 16
        }}
      >
        <input {...getInputProps()} />
        <p style={{ fontSize: 15, color: '#666' }}>
          {isDragActive ? 'Drop files here' : 'Drag and drop files here, or click to select'}
        </p>
        <p style={{ fontSize: 12, color: '#aaa', marginTop: 6 }}>
          Supports PDF, images, Excel, Word
        </p>
      </div>

      {files.length > 0 && (
        <div style={{ marginBottom: 20 }}>
          {files.map((f, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: '#fff', border: '1px solid #eee', borderRadius: 8, marginBottom: 6 }}>
              <span style={{ fontSize: 13 }}>{f.name}</span>
              <button onClick={() => removeFile(i)} style={{ fontSize: 11, color: '#e53e3e', background: 'none', border: 'none', cursor: 'pointer' }}>Remove</button>
            </div>
          ))}
        </div>
      )}

      {error && <p style={{ color: '#e53e3e', fontSize: 13, marginBottom: 12 }}>{error}</p>}

      <button
        onClick={analyze}
        disabled={loading}
        style={{ width: '100%', padding: '12px', background: '#4f46e5', color: '#fff', border: 'none', borderRadius: 8, fontSize: 15, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}
      >
        {loading ? 'Analysing...' : 'Analyse documents'}
      </button>
    </div>
  )
}