export const StatCard = ({ label, value, color, }: { label: string; value: string |number; color: string ; }) => (
  <div style={{
    background: '#fff',
    border: '1px solid #e8e4df',
    borderRadius: '12px',
    padding: '1rem 1.25rem',
    flex: 1,
    minWidth: '120px',
  }}
   className="bg-white">
    <p style={{ fontSize: '0.7rem', color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.4rem' }}>{label}</p>
    <p style={{ fontSize: '1.4rem', fontWeight: 700, color, fontFamily: 'Georgia, serif' }}>{value}</p>
  </div>
)