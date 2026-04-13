import * as XLSX from 'xlsx';

export function exportTicketsToExcel(tickets) {
  // Mapear los tickets a filas legibles
  const rows = tickets.map(t => ({
    'ID':           `#${t.id}`,
    'Título':       t.title,
    'Descripción':  t.description || '',
    'Cliente':      t.client_name,
    'Prioridad':    t.priority_name,
    'Estado':       t.status_name,
    'Agente':       t.agent_name || 'Sin asignar',
    'Fecha Creación': new Date(t.created_at).toLocaleString('es-CO', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit', second: '2-digit',
      hour12: false
    }),
  }));

  // Crear hoja
  const worksheet = XLSX.utils.json_to_sheet(rows);

  // Ancho de columnas
  worksheet['!cols'] = [
    { wch: 6  },  // ID
    { wch: 40 },  // Título
    { wch: 50 },  // Descripción
    { wch: 25 },  // Cliente
    { wch: 12 },  // Prioridad
    { wch: 14 },  // Estado
    { wch: 22 },  // Agente
    { wch: 20 },  // Fecha
  ];

  // Crear libro
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Tickets');

  // Hoja de resumen por estado
  const resumen = [
    { 'Estado': 'Abierto',      'Total': tickets.filter(t => t.status_name === 'Abierto').length },
    { 'Estado': 'En progreso',  'Total': tickets.filter(t => t.status_name === 'En progreso').length },
    { 'Estado': 'Resuelto',     'Total': tickets.filter(t => t.status_name === 'Resuelto').length },
    { 'Estado': 'TOTAL',        'Total': tickets.length },
  ];
  const wsResumen = XLSX.utils.json_to_sheet(resumen);
  wsResumen['!cols'] = [{ wch: 16 }, { wch: 8 }];
  XLSX.utils.book_append_sheet(workbook, wsResumen, 'Resumen');

  // Nombre del archivo con fecha
  const fecha = new Date().toLocaleDateString('es-CO', {
    day: '2-digit', month: '2-digit', year: 'numeric'
  }).replace(/\//g, '-');

  XLSX.writeFile(workbook, `tickets_soporte_${fecha}.xlsx`);
}
