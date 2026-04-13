const { getPool } = require("../db");

const getAgents = async (req, res) => {
  try {
    const pool = await getPool();
    const result = await pool.request().query(`SELECT id, name, email FROM agents ORDER BY name`);
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener agentes" });
  }
};

const getClients = async (req, res) => {
  try {
    const pool = await getPool();
    const result = await pool.request().query(`SELECT id, name, email FROM clients ORDER BY name`);
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener clientes" });
  }
};

const getPriorities = async (req, res) => {
  try {
    const pool = await getPool();
    const result = await pool.request().query(`SELECT id, name, level, color FROM priorities ORDER BY level`);
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener prioridades" });
  }
};

module.exports = { getAgents, getClients, getPriorities };
