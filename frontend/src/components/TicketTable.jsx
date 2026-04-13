import { useState } from 'react';
import { api } from '../services/api';

const priorityClass = (name) =>
  `badge badge-priority-${name.toLowerCase().replace(' ', '-')}`;

const statusClass = (name) =>
  `badge badge-status-${name.toLowerCase().replace(' ', '-').replace(' ', '-')}`;

const navBtn = (disabled, active = false) => ({
  background: active ? 'var(--accent)' : 'var(--bg-4)',
  border: '1px solid ' + (active ? 'var(--accent)' : 'var(--border-light)'),
  borderRadius: 'var(--radius-sm)',
  color: active ? '#fff' : disabled ? 'var(--text-muted)' : 'var(--text-1)',
  padding: '3px 9px',
  fontSize: '0.78rem',
  fontFamily: 'var(--font-mono)',
  cursor: disabled ? 'not-allowed' : 'pointer',
  opacity: disabled ? 0.4 : 1,
  minWidth: '30px',
  transition: 'all 0.15s',
});

const SORT_FIELDS = {
  id:            (t) => t.id,
  title:         (t) => t.title.toLowerCase(),
  client:        (t) => t.client_name.toLowerCase(),
  priority:      (t) => t.priority_level,
  status:        (t) => t.status_id,
  agent:         (t) => (t.agent_name || '').toLowerCase(),
  date:          (t) => new Date(t.created_at).getTime(),
};

function SortIcon({ field, sortField, sortDir }) {
  if (sortField !== field) return <span style={{ color: 'var(--text-muted)', marginLeft: 4, fontSize: '0.65rem' }}>⇅</span>;
  return <span style={{ color: 'var(--accent)', marginLeft: 4, fontSize: '0.65rem' }}>{sortDir === 'asc' ? '↑' : '↓'}</span>;
}

export default function TicketTable({ tickets, onRefresh, onToast }) {
  const [sortField, setSortField] = useState('id');
  const [sortDir,   setSortDir]   = useState('asc');
  const [perPage,   setPerPage]   = useState(10);
  const [page,      setPage]      = useState(1);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('asc');
    }
    setPage(1);
  };

  const sorted = [...tickets].sort((a, b) => {
    const fn = SORT_FIELDS[sortField];
    const va = fn(a);
    const vb = fn(b);
    if (va < vb) return sortDir === 'asc' ? -1 :  1;
    if (va > vb) return sortDir === 'asc' ?  1 : -1;
    return 0;
  });

  const totalPages = perPage === 0 ? 1 : Math.ceil(sorted.length / perPage);
  const currentPage = Math.min(page, totalPages);
  const paginated = perPage === 0 ? sorted : sorted.slice((currentPage - 1) * perPage, currentPage * perPage);

  const handleAdvance = async (id) => {
    try {
      const r = await api.advanceStatus(id);
      onToast(r.message, 'success');
      onRefresh();
    } catch (e) {
      onToast(e.message, 'error');
    }
  };

  const handleDelete = async (id, title) => {
    if (!confirm(`¿Eliminar el ticket "${title}"?`)) return;
    try {
      const r = await api.deleteTicket(id);
      onToast(r.message, 'success');
      onRefresh();
    } catch (e) {
      onToast(e.message, 'error');
    }
  };

  const thStyle = (field) => ({
    cursor: 'pointer',
    userSelect: 'none',
    whiteSpace: 'nowrap',
    background: sortField === field ? 'var(--bg-4)' : undefined,
    transition: 'background 0.15s',
  });

  if (!tickets.length) {
    return (
      <div className="table-wrapper">
        <div className="empty-state">
          <div className="empty-icon">🎫</div>
          <div className="empty-title">Sin tickets registrados</div>
          <div className="empty-sub">Crea el primer ticket de soporte usando el botón superior</div>
        </div>
      </div>
    );
  }

  return (
    <div className="table-wrapper">
      <table className="tickets-table">
        <thead>
          <tr>
            <th style={thStyle('id')}     onClick={() => handleSort('id')}>
              # <SortIcon field="id"       sortField={sortField} sortDir={sortDir} />
            </th>
            <th style={thStyle('title')}  onClick={() => handleSort('title')}>
              Título <SortIcon field="title"    sortField={sortField} sortDir={sortDir} />
            </th>
            <th style={thStyle('client')} onClick={() => handleSort('client')}>
              Cliente <SortIcon field="client"  sortField={sortField} sortDir={sortDir} />
            </th>
            <th style={thStyle('priority')} onClick={() => handleSort('priority')}>
              Prioridad <SortIcon field="priority" sortField={sortField} sortDir={sortDir} />
            </th>
            <th style={thStyle('status')} onClick={() => handleSort('status')}>
              Estado <SortIcon field="status"  sortField={sortField} sortDir={sortDir} />
            </th>
            <th style={thStyle('agent')}  onClick={() => handleSort('agent')}>
              Agente <SortIcon field="agent"   sortField={sortField} sortDir={sortDir} />
            </th>
            <th style={thStyle('date')}   onClick={() => handleSort('date')}>
              Fecha <SortIcon field="date"    sortField={sortField} sortDir={sortDir} />
            </th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {paginated.map(t => (
            <tr key={t.id}>
              <td>
                <span className="ticket-id">#{t.id}</span>
              </td>
              <td>
                <div className="ticket-title">{t.title}</div>
                {t.description && (
                  <div className="ticket-desc">{t.description}</div>
                )}
              </td>
              <td>{t.client_name}</td>
              <td>
                <span className={priorityClass(t.priority_name)}>
                  <span className="dot-indicator" />
                  {t.priority_name}
                </span>
              </td>
              <td>
                <span className={statusClass(t.status_name)}>
                  <span className="dot-indicator" />
                  {t.status_name}
                </span>
              </td>
              <td>
                {t.agent_name || (
                  <span style={{ color: 'var(--text-muted)' }}>—</span>
                )}
              </td>
              <td style={{ color: 'var(--text-muted)', fontSize: '0.72rem', whiteSpace: 'nowrap' }}>
                {new Date(t.created_at).toLocaleString('es-CO', {
                  day: '2-digit', month: '2-digit', year: 'numeric',
                  hour: '2-digit', minute: '2-digit', second: '2-digit',
                  hour12: false
                })}
              </td>
              <td>
                <div className="actions-cell">
                  {t.status_name !== 'Resuelto' && (
                    <button
                      className="btn btn-advance btn-sm"
                      onClick={() => handleAdvance(t.id)}
                      title="Avanzar al siguiente estado"
                    >
                      Avanzar →
                    </button>
                  )}
                  {t.status_name === 'Abierto' && (
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(t.id, t.title)}
                      title="Eliminar ticket"
                    >
                      ✕
                    </button>
                  )}
                  {t.status_name === 'Resuelto' && (
                    <span style={{ fontSize: '0.72rem', color: 'var(--green)' }}>✓ Completado</span>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Footer: selector + paginación */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '12px 16px', borderTop: '1px solid var(--border)',
        background: 'var(--bg-3)', flexWrap: 'wrap', gap: '8px'
      }}>
        {/* Selector de registros por página */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem', color: 'var(--text-1)' }}>
          <span>Mostrar</span>
          <select
            value={perPage}
            onChange={e => { setPerPage(Number(e.target.value)); setPage(1); }}
            style={{
              background: 'var(--bg-4)', border: '1px solid var(--border-light)',
              borderRadius: 'var(--radius-sm)', color: 'var(--text-0)',
              padding: '3px 8px', fontSize: '0.78rem', fontFamily: 'var(--font-mono)', cursor: 'pointer'
            }}
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
            <option value={0}>Todos</option>
          </select>
          <span>registros &mdash; mostrando {perPage === 0 ? sorted.length : Math.min(perPage * currentPage, sorted.length)} de {sorted.length}</span>
        </div>

        {/* Navegación de páginas */}
        {perPage !== 0 && totalPages > 1 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <button
              onClick={() => setPage(1)}
              disabled={currentPage === 1}
              style={navBtn(currentPage === 1)}
              title="Primera página"
            >«</button>
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              style={navBtn(currentPage === 1)}
              title="Anterior"
            >‹</button>

            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
              .reduce((acc, p, idx, arr) => {
                if (idx > 0 && p - arr[idx - 1] > 1) acc.push('...');
                acc.push(p);
                return acc;
              }, [])
              .map((p, idx) =>
                p === '...'
                  ? <span key={idx} style={{ color: 'var(--text-muted)', padding: '0 4px', fontSize: '0.78rem' }}>…</span>
                  : <button
                      key={p}
                      onClick={() => setPage(p)}
                      style={navBtn(false, p === currentPage)}
                    >{p}</button>
              )
            }

            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              style={navBtn(currentPage === totalPages)}
              title="Siguiente"
            >›</button>
            <button
              onClick={() => setPage(totalPages)}
              disabled={currentPage === totalPages}
              style={navBtn(currentPage === totalPages)}
              title="Última página"
            >»</button>
          </div>
        )}
      </div>
    </div>
  );
}
