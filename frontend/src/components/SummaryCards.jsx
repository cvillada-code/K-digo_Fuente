export default function SummaryCards({ summary }) {
  const map = {
    'Abierto': 'abierto',
    'En progreso': 'en-progreso',
    'Resuelto': 'resuelto',
  };
  const icons = { 'Abierto': '◎', 'En progreso': '⟳', 'Resuelto': '✓' };
  const desc = {
    'Abierto': 'pendientes de atención',
    'En progreso': 'siendo atendidos',
    'Resuelto': 'completados',
  };

  return (
    <div className="summary">
      {summary.map(s => (
        <div key={s.status} className={`summary-card ${map[s.status] || ''}`}>
          <span className="summary-label">{icons[s.status]} {s.status}</span>
          <span className="summary-count">{s.total}</span>
          <span className="summary-sub">{desc[s.status] || 'tickets'}</span>
        </div>
      ))}
    </div>
  );
}
