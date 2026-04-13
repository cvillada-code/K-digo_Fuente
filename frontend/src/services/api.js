const BASE = '/api';

async function req(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Error en la solicitud');
  return data;
}

export const api = {
  getTickets:     ()             => req('/tickets'),
  getSummary:     ()             => req('/tickets/summary'),
  createTicket:   (body)         => req('/tickets', { method: 'POST', body: JSON.stringify(body) }),
  advanceStatus:  (id)           => req(`/tickets/${id}/advance`, { method: 'PATCH' }),
  deleteTicket:   (id)           => req(`/tickets/${id}`, { method: 'DELETE' }),

  getAgents:      ()             => req('/agents'),
  getClients:     ()             => req('/clients'),
  getPriorities:  ()             => req('/priorities'),
};
