import { useLocation, useNavigate } from 'react-router-dom'

const FLAG_COLORS = {
  duplicate: '#fef9c3',
  inflated: '#fee2e2',
  unauthorised: '#ede9fe',
  negotiable: '#dcfce7',
  unbundled: '#ffedd5',
  ok: '#f9fafb'
}

export default function ResultsPage() {
  const { state } = useLocation()
  const navigate = useNavigate()
  const result = state?.result

  if (!result) return (
    <div style={{ maxWidth: 680, margin: '40px auto', padding: '0 20px' }}>
      <p>No results found. <button onClick={() => navigate('/')}>Go back</button></p>
    </div>
  )

  const billing = result.billing_result || {}
  const insurance = result.insurance_result || {}
  const flags = billing.flags || []
  const missing = insurance.missing_documents || []
  const coverage = insurance.coverage_results || []

  const downloadReport = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/generate-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          run_id: result.run_id || 'report',
          billing_result: result.billing_result,
          insurance_result: result.insurance_result,
          claim_guide: result.claim_guide,
          dispute_letter: result.dispute_letter
        })
      })
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'audit_report.pdf'
      a.click()
      window.URL.revokeObjectURL(url)
    } catch (e) {
      alert('Failed to download report. Make sure backend is running.')
    }
  }

  return (
    <div style={{ maxWidth: 780, margin: '40px auto', padding: '0 20px' }}>

      {/* Top buttons */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
        <button
          onClick={() => navigate('/')}
          style={{ fontSize: 13, color: '#4f46e5', background: 'none', border: '1px solid #4f46e5', borderRadius: 8, padding: '8px 16px', cursor: 'pointer' }}
        >
          ← Back to upload
        </button>
        <button
          onClick={downloadReport}
          style={{ fontSize: 13, padding: '8px 16px', background: '#4f46e5', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer' }}
        >
          Download PDF report
        </button>
      </div>

      <h1 style={{ fontSize: 22, fontWeight: 600, marginBottom: 20 }}>Audit results</h1>

      {/* Summary cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12, marginBottom: 24 }}>
        {[
          { label: 'Total billed', value: `Rs ${(billing.total_billed || 0).toLocaleString()}` },
          { label: 'Potential savings', value: `Rs ${(billing.total_potential_savings || 0).toLocaleString()}` },
          { label: 'Flags found', value: flags.filter(f => f.flag_type !== 'ok').length },
          { label: 'Missing docs', value: missing.length }
        ].map(c => (
          <div key={c.label} style={{ background: '#fff', border: '1px solid #eee', borderRadius: 10, padding: '14px 16px' }}>
            <p style={{ fontSize: 12, color: '#888', marginBottom: 4 }}>{c.label}</p>
            <p style={{ fontSize: 22, fontWeight: 600 }}>{c.value}</p>
          </div>
        ))}
      </div>

      {/* Patient summary */}
      {billing.summary_for_patient && (
        <div style={{ background: '#eef2ff', borderRadius: 10, padding: '14px 16px', marginBottom: 24, fontSize: 14, color: '#3730a3' }}>
          {billing.summary_for_patient}
        </div>
      )}

      {/* Billing flags */}
      <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>Billing flags</h2>
      <div style={{ marginBottom: 24 }}>
        {flags.map((f, i) => (
          <div key={i} style={{ background: FLAG_COLORS[f.flag_type] || '#f9fafb', border: '1px solid #eee', borderRadius: 8, padding: '12px 14px', marginBottom: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{ fontSize: 13, fontWeight: 500 }}>{f.line_item}</span>
              <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 4, background: '#fff', border: '1px solid #ddd' }}>{f.flag_type}</span>
            </div>
            <p style={{ fontSize: 12, color: '#555', marginBottom: 4 }}>{f.plain_explanation}</p>
            <p style={{ fontSize: 12, color: '#4f46e5' }}>{f.action}</p>
          </div>
        ))}
      </div>

      {/* Insurance coverage */}
      {coverage.length > 0 && (
        <>
          <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>Insurance coverage</h2>
          <div style={{ marginBottom: 24 }}>
            {coverage.map((c, i) => (
              <div key={i} style={{ background: '#fff', border: '1px solid #eee', borderRadius: 8, padding: '12px 14px', marginBottom: 8 }}>
                <p style={{ fontSize: 13, fontWeight: 500, marginBottom: 4 }}>{c.item}</p>
                <p style={{ fontSize: 12, color: '#555', whiteSpace: 'pre-wrap' }}>{c.coverage}</p>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Missing documents */}
      {missing.length > 0 && (
        <>
          <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>Missing documents</h2>
          <div style={{ background: '#fff', border: '1px solid #eee', borderRadius: 10, padding: '14px 16px', marginBottom: 24 }}>
            {missing.map((m, i) => (
              <div key={i} style={{ fontSize: 13, color: '#e53e3e', padding: '4px 0', borderBottom: i < missing.length - 1 ? '1px solid #f0f0f0' : 'none' }}>
                ☐ {m}
              </div>
            ))}
          </div>
        </>
      )}

      {/* Claim guide */}
      {result.claim_guide && (
        <>
          <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>Claim guide</h2>
          <div style={{ background: '#fff', border: '1px solid #eee', borderRadius: 10, padding: '14px 16px', marginBottom: 24, fontSize: 13, color: '#333', whiteSpace: 'pre-wrap', lineHeight: 1.7 }}>
            {result.claim_guide}
          </div>
        </>
      )}

      {/* Dispute letter */}
      {result.dispute_letter && (
        <>
          <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>Dispute letter</h2>
          <div style={{ background: '#fff', border: '1px solid #eee', borderRadius: 10, padding: '14px 16px', marginBottom: 24, fontSize: 13, color: '#333', whiteSpace: 'pre-wrap', lineHeight: 1.7 }}>
            {result.dispute_letter}
          </div>
        </>
      )}

    </div>
  )
}