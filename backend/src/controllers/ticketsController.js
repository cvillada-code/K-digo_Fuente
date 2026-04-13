const { getPool, sql } = require("../db");

const getAll = async (req, res) => {
  try {
    const pool = await getPool();
    const result = await pool.request().query(`
      SELECT
        t.id, t.title, t.description, t.created_at, t.updated_at,
        c.name  AS client_name,
        p.name  AS priority_name, p.level AS priority_level, p.color AS priority_color,
        s.name  AS status_name,  s.id    AS status_id,
        a.name  AS agent_name
      FROM tickets t
      JOIN clients   c ON c.id = t.client_id
      JOIN priorities p ON p.id = t.priority_id
      JOIN statuses  s ON s.id = t.status_id
      LEFT JOIN agents a ON a.id = t.agent_id
      ORDER BY p.level ASC, t.created_at DESC
    `);
    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener tickets" });
  }
};

const getSummary = async (req, res) => {
  try {
    const pool = await getPool();
    const result = await pool.request().query(`
      SELECT s.name AS status, COUNT(t.id) AS total
      FROM statuses s
      LEFT JOIN tickets t ON t.status_id = s.id
      GROUP BY s.id, s.name, s.display_order
      ORDER BY s.display_order
    `);
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener resumen" });
  }
};

const create = async (req, res) => {
  const { title, description, client_id, priority_id, agent_id } = req.body;

  if (!title || !client_id || !priority_id) {
    return res.status(400).json({ error: "Título, cliente y prioridad son obligatorios" });
  }

  try {
    const pool = await getPool();

    // Get "Abierto" status id
    const statusRes = await pool.request().query(`SELECT id FROM statuses WHERE name = 'Abierto'`);
    const statusId = statusRes.recordset[0].id;

    const result = await pool.request()
      .input("title",       sql.NVarChar, title)
      .input("description", sql.NVarChar, description || "")
      .input("client_id",   sql.Int, client_id)
      .input("priority_id", sql.Int, priority_id)
      .input("status_id",   sql.Int, statusId)
      .input("agent_id",    sql.Int, agent_id || null)
      .query(`
        INSERT INTO tickets (title, description, client_id, priority_id, status_id, agent_id)
        OUTPUT INSERTED.id
        VALUES (@title, @description, @client_id, @priority_id, @status_id, @agent_id)
      `);

    const newId = result.recordset[0].id;

    // Log history
    await pool.request()
      .input("ticket_id",    sql.Int, newId)
      .input("new_status_id",sql.Int, statusId)
      .input("notes",        sql.NVarChar, "Ticket creado")
      .query(`
        INSERT INTO ticket_history (ticket_id, new_status_id, notes)
        VALUES (@ticket_id, @new_status_id, @notes)
      `);

    res.status(201).json({ id: newId, message: "Ticket creado exitosamente" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al crear ticket" });
  }
};

const advanceStatus = async (req, res) => {
  const { id } = req.params;
  try {
    const pool = await getPool();

    // Get current ticket
    const ticketRes = await pool.request()
      .input("id", sql.Int, id)
      .query(`
        SELECT t.status_id, s.name AS status_name, s.display_order
        FROM tickets t
        JOIN statuses s ON s.id = t.status_id
        WHERE t.id = @id
      `);

    if (!ticketRes.recordset.length) {
      return res.status(404).json({ error: "Ticket no encontrado" });
    }

    const ticket = ticketRes.recordset[0];

    if (ticket.status_name === "Resuelto") {
      return res.status(400).json({ error: "Un ticket Resuelto no puede modificarse" });
    }

    // Get next status
    const nextStatusRes = await pool.request()
      .input("order", sql.Int, ticket.display_order + 1)
      .query(`SELECT id, name FROM statuses WHERE display_order = @order`);

    if (!nextStatusRes.recordset.length) {
      return res.status(400).json({ error: "No hay siguiente estado disponible" });
    }

    const nextStatus = nextStatusRes.recordset[0];

    await pool.request()
      .input("status_id",  sql.Int, nextStatus.id)
      .input("id",         sql.Int, id)
      .query(`UPDATE tickets SET status_id = @status_id, updated_at = GETDATE() WHERE id = @id`);

    // Log history
    await pool.request()
      .input("ticket_id",     sql.Int, id)
      .input("old_status_id", sql.Int, ticket.status_id)
      .input("new_status_id", sql.Int, nextStatus.id)
      .input("notes",         sql.NVarChar, `Estado cambiado a ${nextStatus.name}`)
      .query(`
        INSERT INTO ticket_history (ticket_id, old_status_id, new_status_id, notes)
        VALUES (@ticket_id, @old_status_id, @new_status_id, @notes)
      `);

    res.json({ message: `Estado actualizado a "${nextStatus.name}"` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al actualizar estado" });
  }
};

const remove = async (req, res) => {
  const { id } = req.params;
  try {
    const pool = await getPool();

    const ticketRes = await pool.request()
      .input("id", sql.Int, id)
      .query(`
        SELECT t.id, s.name AS status_name
        FROM tickets t
        JOIN statuses s ON s.id = t.status_id
        WHERE t.id = @id
      `);

    if (!ticketRes.recordset.length) {
      return res.status(404).json({ error: "Ticket no encontrado" });
    }

    const ticket = ticketRes.recordset[0];

    if (ticket.status_name !== "Abierto") {
      return res.status(400).json({ error: "Solo se pueden eliminar tickets en estado Abierto" });
    }

    await pool.request()
      .input("id", sql.Int, id)
      .query(`DELETE FROM tickets WHERE id = @id`);

    res.json({ message: "Ticket eliminado exitosamente" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al eliminar ticket" });
  }
};

module.exports = { getAll, getSummary, create, advanceStatus, remove };
