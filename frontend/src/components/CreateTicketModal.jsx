import { useState } from 'react';
import { api } from '../services/api';

export default function CreateTicketModal({ catalogs, onClose, onCreated }) {
  const { agents, clients, priorities } = catalogs;
  const [form, setForm] = useState({
    title: '',
    description: '',
    client_id: '',
    priority_id: '',
    agent_id: '',
  });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const set = (k, v) => {
    setForm(f => ({ ...f, [k]: v }));
    if (errors[k]) setErrors(e => ({ ...e, [k]: null }));
  };

  const validate = () => {
    const e = {};
    if (!form.title.trim())  e.title      = 'El título es obligatorio';
    if (!form.client_id)     e.client_id  = 'Selecciona un cliente';
    if (!form.priority_id)   e.priority_id = 'Selecciona una prioridad';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      await api.createTicket({
        title:       form.title.trim(),
        description: form.description.trim(),
        client_id:   Number(form.client_id),
        priority_id: Number(form.priority_id),
        agent_id:    form.agent_id ? Number(form.agent_id) : null,
      });
      onCreated('Ticket creado exitosamente', 'success');
    } catch (e) {
      onCreated(e.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal">
        <div className="modal-header">
          <span className="modal-title">Nuevo Ticket de Soporte</span>
          <button className="modal-close" onClick={onClose} aria-label="Cerrar">×</button>
        </div>

        <div className="modal-body">
          {/* Título */}
          <div className="field">
            <label>Título <span className="required">*</span></label>
            <input
              className={`input ${errors.title ? 'error' : ''}`}
              value={form.title}
              onChange={e => set('title', e.target.value)}
              placeholder="Describe el problema brevemente..."
              autoFocus
            />
            {errors.title && <span className="field-error">{errors.title}</span>}
          </div>

          {/* Descripción */}
          <div className="field">
            <label>Descripción</label>
            <textarea
              className="textarea"
              value={form.description}
              onChange={e => set('description', e.target.value)}
              placeholder="Detalles adicionales del problema..."
              rows={3}
            />
          </div>

          {/* Cliente + Prioridad */}
          <div className="fields-row">
            <div className="field">
              <label>Cliente <span className="required">*</span></label>
              <select
                className={`select ${errors.client_id ? 'error' : ''}`}
                value={form.client_id}
                onChange={e => set('client_id', e.target.value)}
              >
                <option value="">Seleccionar cliente...</option>
                {clients.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
              {errors.client_id && <span className="field-error">{errors.client_id}</span>}
            </div>

            <div className="field">
              <label>Prioridad <span className="required">*</span></label>
              <select
                className={`select ${errors.priority_id ? 'error' : ''}`}
                value={form.priority_id}
                onChange={e => set('priority_id', e.target.value)}
              >
                <option value="">Seleccionar prioridad...</option>
                {priorities.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
              {errors.priority_id && <span className="field-error">{errors.priority_id}</span>}
            </div>
          </div>

          {/* Agente */}
          <div className="field">
            <label>Agente asignado</label>
            <select
              className="select"
              value={form.agent_id}
              onChange={e => set('agent_id', e.target.value)}
            >
              <option value="">Sin asignar</option>
              {agents.map(a => (
                <option key={a.id} value={a.id}>{a.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose} disabled={saving}>
            Cancelar
          </button>
          <button className="btn btn-primary" onClick={handleSubmit} disabled={saving}>
            {saving ? 'Guardando...' : '+ Crear Ticket'}
          </button>
        </div>
      </div>
    </div>
  );
}
