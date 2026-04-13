// tests/tickets.test.js
// Pruebas unitarias del controlador de tickets
// Usa mocks para no necesitar conexión real a SQL Server

jest.mock('../src/db', () => ({
  getPool: jest.fn(),
  sql: {
    NVarChar: 'NVarChar',
    Int: 'Int',
  },
}));

const { getPool } = require('../src/db');

// Helper para crear mock de request/response de Express
const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json   = jest.fn().mockReturnValue(res);
  return res;
};

const mockRequest = (requestFn) => ({
  request: jest.fn().mockReturnValue({
    input: jest.fn().mockReturnThis(),
    query: requestFn,
  }),
});

// ─────────────────────────────────────────
describe('GET /api/tickets — getAll', () => {
  const { getAll } = require('../src/controllers/ticketsController');

  it('devuelve lista de tickets correctamente', async () => {
    const mockTickets = [
      { id: 1, title: 'Test ticket', client_name: 'Empresa ABC', status_name: 'Abierto', priority_name: 'Alto' },
    ];
    getPool.mockResolvedValue(mockRequest(jest.fn().mockResolvedValue({ recordset: mockTickets })));

    const req = {};
    const res = mockRes();
    await getAll(req, res);

    expect(res.json).toHaveBeenCalledWith(mockTickets);
  });

  it('retorna 500 si falla la base de datos', async () => {
    getPool.mockResolvedValue(mockRequest(jest.fn().mockRejectedValue(new Error('DB error'))));

    const req = {};
    const res = mockRes();
    await getAll(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Error al obtener tickets' });
  });
});

// ─────────────────────────────────────────
describe('POST /api/tickets — create', () => {
  const { create } = require('../src/controllers/ticketsController');

  it('retorna 400 si falta el título', async () => {
    const req = { body: { client_id: 1, priority_id: 1 } };
    const res = mockRes();
    await create(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Título, cliente y prioridad son obligatorios',
    });
  });

  it('retorna 400 si falta el cliente', async () => {
    const req = { body: { title: 'Error en sistema', priority_id: 1 } };
    const res = mockRes();
    await create(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('retorna 400 si falta la prioridad', async () => {
    const req = { body: { title: 'Error en sistema', client_id: 1 } };
    const res = mockRes();
    await create(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('crea ticket correctamente con datos válidos', async () => {
    const pool = {
      request: jest.fn().mockReturnValue({
        input: jest.fn().mockReturnThis(),
        query: jest.fn()
          .mockResolvedValueOnce({ recordset: [{ id: 1 }] })  // status query
          .mockResolvedValueOnce({ recordset: [{ id: 10 }] }) // insert ticket
          .mockResolvedValueOnce({ recordset: [] }),           // insert history
      }),
    };
    getPool.mockResolvedValue(pool);

    const req = { body: { title: 'Falla red', client_id: 1, priority_id: 2, agent_id: 1 } };
    const res = mockRes();
    await create(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
  });
});

// ─────────────────────────────────────────
describe('DELETE /api/tickets/:id — remove', () => {
  const { remove } = require('../src/controllers/ticketsController');

  it('retorna 404 si el ticket no existe', async () => {
    getPool.mockResolvedValue(mockRequest(jest.fn().mockResolvedValue({ recordset: [] })));

    const req = { params: { id: 999 } };
    const res = mockRes();
    await remove(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'Ticket no encontrado' });
  });

  it('retorna 400 si el ticket no está en estado Abierto', async () => {
    getPool.mockResolvedValue(
      mockRequest(jest.fn().mockResolvedValue({
        recordset: [{ id: 1, status_name: 'En progreso' }],
      }))
    );

    const req = { params: { id: 1 } };
    const res = mockRes();
    await remove(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Solo se pueden eliminar tickets en estado Abierto',
    });
  });
});

// ─────────────────────────────────────────
describe('PATCH /api/tickets/:id/advance — advanceStatus', () => {
  const { advanceStatus } = require('../src/controllers/ticketsController');

  it('retorna 400 si el ticket ya está Resuelto', async () => {
    getPool.mockResolvedValue(
      mockRequest(jest.fn().mockResolvedValue({
        recordset: [{ status_id: 3, status_name: 'Resuelto', display_order: 3 }],
      }))
    );

    const req = { params: { id: 1 } };
    const res = mockRes();
    await advanceStatus(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Un ticket Resuelto no puede modificarse',
    });
  });

  it('retorna 404 si el ticket no existe', async () => {
    getPool.mockResolvedValue(mockRequest(jest.fn().mockResolvedValue({ recordset: [] })));

    const req = { params: { id: 999 } };
    const res = mockRes();
    await advanceStatus(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });
});
