import { useState } from 'react';
import { useTickets, useCatalogs } from './hooks/useTickets';
import SummaryCards from './components/SummaryCards';
import TicketTable from './components/TicketTable';
import CreateTicketModal from './components/CreateTicketModal';
import Toast from './components/Toast';
import { exportTicketsToExcel } from './services/exportExcel';

export default function App() {
  const { tickets, summary, loading, error, refresh } = useTickets();
  const catalogs = useCatalogs();
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = 'success') => setToast({ msg, type });

  const handleCreated = (msg, type = 'success') => {
    setShowModal(false);
    showToast(msg, type);
    if (type === 'success') refresh();
  };

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="header-logo">
          <span className="dot" />
          SupportDesk
        </div>
        <div className="header-right">
          <button
            className="btn btn-ghost btn-sm"
            onClick={refresh}
            title="Actualizar lista"
            style={{ marginRight: 4 }}
          >
            ↺
          </button>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            + Nuevo Ticket
          </button>
        </div>
      </header>

      <main className="main">
        {/* Summary */}
        <SummaryCards summary={summary} />

        {/* Toolbar */}
        <div className="toolbar">
          <div className="toolbar-left">
            <span className="section-title">Tickets de Soporte</span>
            {!loading && (
              <span className="ticket-count">{tickets.length} registros</span>
            )}
          </div>
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => exportTicketsToExcel(tickets)}
            disabled={!tickets.length}
            title="Descargar todos los tickets en Excel"
            style={{ color: 'var(--green)', borderColor: 'rgba(34,197,94,0.3)' }}
          >
            ↓ Exportar Excel
          </button>
        </div>

        {/* Content */}
        {error ? (
          <div className="table-wrapper">
            <div className="empty-state">
              <div className="empty-icon">⚠️</div>
              <div className="empty-title">Error al cargar los datos</div>
              <div className="empty-sub">{error}</div>
              <button className="btn btn-ghost" style={{ marginTop: '1rem' }} onClick={refresh}>
                Reintentar
              </button>
            </div>
          </div>
        ) : loading ? (
          <div className="loading">
            <div className="spinner" />
            <span>Cargando tickets...</span>
          </div>
        ) : (
          <TicketTable
            tickets={tickets}
            onRefresh={refresh}
            onToast={showToast}
          />
        )}
      </main>

      {/* Modal */}
      {showModal && (
        <CreateTicketModal
          catalogs={catalogs}
          onClose={() => setShowModal(false)}
          onCreated={handleCreated}
        />
      )}

      {/* Toast */}
      {toast && (
        <Toast
          message={toast.msg}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
