const sql = require("mssql");

const config = {
  server: process.env.DB_SERVER || "localhost",
  port: parseInt(process.env.DB_PORT) || 1433,
  user: process.env.DB_USER || "sa",
  password: process.env.DB_PASSWORD || "Admin24*52*24",
  database: process.env.DB_NAME || "SupportTickets",
  options: {
  encrypt: false,
  trustServerCertificate: true,
  enableArithAbort: true,
  //instanceName: 'BD1',
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
};

let pool;

async function getPool() {
  if (!pool) {
    pool = await sql.connect(config);
  }
  return pool;
}

async function initDB() {
  // La base de datos SupportTickets debe existir previamente en el servidor externo
  const p = await getPool();

  // Priorities table
  await p.request().query(`
    IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='priorities' AND xtype='U')
    CREATE TABLE priorities (
      id INT PRIMARY KEY IDENTITY(1,1),
      name NVARCHAR(50) NOT NULL,
      level INT NOT NULL,
      color NVARCHAR(20) NOT NULL
    );
  `);

  // Statuses table
  await p.request().query(`
    IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='statuses' AND xtype='U')
    CREATE TABLE statuses (
      id INT PRIMARY KEY IDENTITY(1,1),
      name NVARCHAR(50) NOT NULL,
      display_order INT NOT NULL
    );
  `);

  // Agents table
  await p.request().query(`
    IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='agents' AND xtype='U')
    CREATE TABLE agents (
      id INT PRIMARY KEY IDENTITY(1,1),
      name NVARCHAR(100) NOT NULL,
      email NVARCHAR(150) NOT NULL
    );
  `);

  // Clients table
  await p.request().query(`
    IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='clients' AND xtype='U')
    CREATE TABLE clients (
      id INT PRIMARY KEY IDENTITY(1,1),
      name NVARCHAR(100) NOT NULL,
      email NVARCHAR(150)
    );
  `);

  // Tickets table
  await p.request().query(`
    IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='tickets' AND xtype='U')
    CREATE TABLE tickets (
      id INT PRIMARY KEY IDENTITY(1,1),
      title NVARCHAR(200) NOT NULL,
      description NVARCHAR(MAX),
      client_id INT NOT NULL REFERENCES clients(id),
      priority_id INT NOT NULL REFERENCES priorities(id),
      status_id INT NOT NULL REFERENCES statuses(id),
      agent_id INT REFERENCES agents(id),
      created_at DATETIME DEFAULT GETDATE(),
      updated_at DATETIME DEFAULT GETDATE()
    );
  `);

  // Ticket history table
  await p.request().query(`
    IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='ticket_history' AND xtype='U')
    CREATE TABLE ticket_history (
      id INT PRIMARY KEY IDENTITY(1,1),
      ticket_id INT NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
      old_status_id INT REFERENCES statuses(id),
      new_status_id INT NOT NULL REFERENCES statuses(id),
      changed_at DATETIME DEFAULT GETDATE(),
      notes NVARCHAR(500)
    );
  `);

  // Seed priorities
  await p.request().query(`
    IF NOT EXISTS (SELECT 1 FROM priorities)
    INSERT INTO priorities (name, level, color) VALUES
      ('Crítico', 1, '#ef4444'),
      ('Alto',    2, '#f97316'),
      ('Medio',   3, '#eab308'),
      ('Bajo',    4, '#22c55e');
  `);

  // Seed statuses
  await p.request().query(`
    IF NOT EXISTS (SELECT 1 FROM statuses)
    INSERT INTO statuses (name, display_order) VALUES
      ('Abierto',     1),
      ('En progreso', 2),
      ('Resuelto',    3);
  `);

  // Seed agents
  await p.request().query(`
    IF NOT EXISTS (SELECT 1 FROM agents)
    INSERT INTO agents (name, email) VALUES
      ('Ana García',    'ana.garcia@soporte.com'),
      ('Carlos López',  'carlos.lopez@soporte.com'),
      ('María Torres',  'maria.torres@soporte.com'),
      ('Luis Ramírez',  'luis.ramirez@soporte.com');
  `);

  // Seed clients
  await p.request().query(`
    IF NOT EXISTS (SELECT 1 FROM clients)
    INSERT INTO clients (name, email) VALUES
      ('Empresa ABC',    'contacto@abc.com'),
      ('Empresa XYZ',    'soporte@xyz.com'),
      ('Corporación 123','info@corp123.com'),
      ('Startup Delta',  'hola@delta.io');
  `);

  console.log("Database initialized successfully");
}

module.exports = { getPool, initDB, sql };
