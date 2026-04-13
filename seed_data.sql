-- =====================================================
-- SCRIPT DE DATOS DE PRUEBA - SupportDesk
-- Base de datos: SupportTickets
-- =====================================================

USE SupportTickets;
GO

-- =====================================================
-- TABLA 1: priorities
-- =====================================================
IF NOT EXISTS (SELECT 1 FROM priorities)
BEGIN
  INSERT INTO priorities (name, level, color) VALUES
    ('Crítico', 1, '#ef4444'),
    ('Alto',    2, '#f97316'),
    ('Medio',   3, '#eab308'),
    ('Bajo',    4, '#22c55e');

  PRINT '✅ priorities: 4 registros insertados';
END
ELSE
  PRINT '⚠️  priorities: ya tiene datos, se omite';
GO

-- =====================================================
-- TABLA 2: statuses
-- =====================================================
IF NOT EXISTS (SELECT 1 FROM statuses)
BEGIN
  INSERT INTO statuses (name, display_order) VALUES
    ('Abierto',     1),
    ('En progreso', 2),
    ('Resuelto',    3);

  PRINT '✅ statuses: 3 registros insertados';
END
ELSE
  PRINT '⚠️  statuses: ya tiene datos, se omite';
GO

-- =====================================================
-- TABLA 3: agents
-- =====================================================
IF NOT EXISTS (SELECT 1 FROM agents)
BEGIN
  INSERT INTO agents (name, email) VALUES
    ('Ana García',      'ana.garcia@soporte.com'),
    ('Carlos López',    'carlos.lopez@soporte.com'),
    ('María Torres',    'maria.torres@soporte.com'),
    ('Luis Ramírez',    'luis.ramirez@soporte.com'),
    ('Sofía Mendoza',   'sofia.mendoza@soporte.com'),
    ('Andrés Castillo', 'andres.castillo@soporte.com');

  PRINT '✅ agents: 6 registros insertados';
END
ELSE
  PRINT '⚠️  agents: ya tiene datos, se omite';
GO

-- =====================================================
-- TABLA 4: clients
-- =====================================================
IF NOT EXISTS (SELECT 1 FROM clients)
BEGIN
  INSERT INTO clients (name, email) VALUES
    ('Empresa ABC S.A.S',         'contacto@abc.com'),
    ('Corporación XYZ Ltda',      'soporte@xyz.com'),
    ('Grupo Industrial 123',      'info@grupo123.com'),
    ('Startup Delta Tech',        'hola@delta.io'),
    ('Distribuidora El Norte',    'sistemas@elnorte.com'),
    ('Constructora Bolivar',      'ti@bolivar.com'),
    ('Clínica Santa María',       'soporte@santamaria.com.co'),
    ('Colegio San Ignacio',       'admin@sanignacio.edu.co');

  PRINT '✅ clients: 8 registros insertados';
END
ELSE
  PRINT '⚠️  clients: ya tiene datos, se omite';
GO

-- =====================================================
-- TABLA 5: tickets
-- =====================================================
IF NOT EXISTS (SELECT 1 FROM tickets)
BEGIN
  -- Capturar IDs reales desde las tablas de catálogo
  DECLARE @c1 INT = (SELECT id FROM clients    WHERE name = 'Empresa ABC S.A.S');
  DECLARE @c2 INT = (SELECT id FROM clients    WHERE name = 'Corporación XYZ Ltda');
  DECLARE @c3 INT = (SELECT id FROM clients    WHERE name = 'Grupo Industrial 123');
  DECLARE @c4 INT = (SELECT id FROM clients    WHERE name = 'Startup Delta Tech');
  DECLARE @c5 INT = (SELECT id FROM clients    WHERE name = 'Distribuidora El Norte');
  DECLARE @c6 INT = (SELECT id FROM clients    WHERE name = 'Constructora Bolivar');
  DECLARE @c7 INT = (SELECT id FROM clients    WHERE name = 'Clínica Santa María');
  DECLARE @c8 INT = (SELECT id FROM clients    WHERE name = 'Colegio San Ignacio');

  DECLARE @p1 INT = (SELECT id FROM priorities WHERE name = 'Crítico');
  DECLARE @p2 INT = (SELECT id FROM priorities WHERE name = 'Alto');
  DECLARE @p3 INT = (SELECT id FROM priorities WHERE name = 'Medio');
  DECLARE @p4 INT = (SELECT id FROM priorities WHERE name = 'Bajo');

  DECLARE @s1 INT = (SELECT id FROM statuses   WHERE name = 'Abierto');
  DECLARE @s2 INT = (SELECT id FROM statuses   WHERE name = 'En progreso');
  DECLARE @s3 INT = (SELECT id FROM statuses   WHERE name = 'Resuelto');

  DECLARE @a1 INT = (SELECT id FROM agents     WHERE name = 'Ana García');
  DECLARE @a2 INT = (SELECT id FROM agents     WHERE name = 'Carlos López');
  DECLARE @a3 INT = (SELECT id FROM agents     WHERE name = 'María Torres');
  DECLARE @a4 INT = (SELECT id FROM agents     WHERE name = 'Luis Ramírez');
  DECLARE @a5 INT = (SELECT id FROM agents     WHERE name = 'Sofía Mendoza');
  DECLARE @a6 INT = (SELECT id FROM agents     WHERE name = 'Andrés Castillo');

  -- Abiertos
  INSERT INTO tickets (title, description, client_id, priority_id, status_id, agent_id, created_at) VALUES
    (
      'Servidor de correo no responde',
      'Desde esta mañana los usuarios no pueden enviar ni recibir correos. Afecta a toda la empresa.',
      @c1, @p1, @s1, @a1, DATEADD(HOUR, -3, GETDATE())
    ),
    (
      'Error al generar facturas en el sistema',
      'El módulo de facturación arroja error 500 al intentar guardar. Impide operación del día.',
      @c2, @p1, @s1, @a2, DATEADD(HOUR, -5, GETDATE())
    ),
    (
      'Impresora de red sin conexión',
      'La impresora del piso 3 no aparece en la red. Varios usuarios afectados.',
      @c3, @p3, @s1, @a3, DATEADD(DAY, -1, GETDATE())
    ),
    (
      'Solicitud de nuevo usuario en el ERP',
      'Se requiere crear acceso para la nueva contadora. Usuario: mlopez@empresa.com',
      @c4, @p4, @s1, NULL, DATEADD(DAY, -1, GETDATE())
    ),
    (
      'Pantalla azul en equipo de gerencia',
      'El equipo del gerente general presenta BSOD al iniciar. Código: IRQL_NOT_LESS_OR_EQUAL',
      @c5, @p2, @s1, @a4, DATEADD(HOUR, -8, GETDATE())
    ),

  -- En progreso
    (
      'Base de datos lenta en horas pico',
      'Entre las 10am y 12pm el sistema se torna muy lento. Se sospecha de consultas sin índice.',
      @c6, @p2, @s2, @a1, DATEADD(DAY, -2, GETDATE())
    ),
    (
      'VPN no conecta desde trabajo remoto',
      'Tres usuarios remotos no logran establecer conexión VPN desde ayer. Error: timeout.',
      @c7, @p2, @s2, @a5, DATEADD(DAY, -2, GETDATE())
    ),
    (
      'Actualización de antivirus pendiente',
      'Se requiere actualizar el antivirus en 15 equipos del área administrativa.',
      @c8, @p3, @s2, @a6, DATEADD(DAY, -3, GETDATE())
    ),
    (
      'Migración de archivos al servidor nuevo',
      'Mover 200GB de documentos del servidor viejo al nuevo NAS instalado la semana pasada.',
      @c1, @p3, @s2, @a2, DATEADD(DAY, -4, GETDATE())
    ),
    (
      'Configurar backup automático',
      'Programar tarea de respaldo diario a las 2am para la base de datos de producción.',
      @c2, @p2, @s2, @a3, DATEADD(DAY, -3, GETDATE())
    ),

  -- Resueltos
    (
      'Cambio de contraseña de usuario bloqueado',
      'Usuario jperez bloqueado por intentos fallidos. Se requería desbloqueo urgente.',
      @c3, @p4, @s3, @a4, DATEADD(DAY, -5, GETDATE())
    ),
    (
      'Instalación de Office en equipo nuevo',
      'Equipo nuevo del área de marketing sin suite ofimática instalada.',
      @c4, @p4, @s3, @a5, DATEADD(DAY, -6, GETDATE())
    ),
    (
      'Falla en el switch del piso 2',
      'Switch principal del piso 2 sin energía. Se reemplazó por unidad de repuesto.',
      @c5, @p1, @s3, @a1, DATEADD(DAY, -7, GETDATE())
    ),
    (
      'Recuperación de archivo eliminado',
      'Usuario eliminó accidentalmente carpeta de proyectos. Se recuperó desde backup.',
      @c6, @p2, @s3, @a6, DATEADD(DAY, -8, GETDATE())
    ),
    (
      'Configuración de correo en celular',
      'Gerente comercial no podía recibir correos en su iPhone. Problema de configuración IMAP.',
      @c7, @p4, @s3, @a2, DATEADD(DAY, -10, GETDATE())
    );

  PRINT '✅ tickets: 15 registros insertados (5 Abiertos, 5 En progreso, 5 Resueltos)';
END
ELSE
  PRINT '⚠️  tickets: ya tiene datos, se omite';
GO

-- =====================================================
-- TABLA 6: ticket_history
-- =====================================================
IF NOT EXISTS (SELECT 1 FROM ticket_history)
BEGIN
  DECLARE @abierto     INT = (SELECT id FROM statuses WHERE name = 'Abierto');
  DECLARE @en_progreso INT = (SELECT id FROM statuses WHERE name = 'En progreso');
  DECLARE @resuelto    INT = (SELECT id FROM statuses WHERE name = 'Resuelto');

  -- Historial tickets Abiertos (solo creación)
  INSERT INTO ticket_history (ticket_id, old_status_id, new_status_id, changed_at, notes)
  SELECT id, NULL, @abierto, created_at, 'Ticket creado'
  FROM tickets WHERE status_id = @abierto;

  -- Historial tickets En progreso (creación + avance)
  INSERT INTO ticket_history (ticket_id, old_status_id, new_status_id, changed_at, notes)
  SELECT id, NULL, @abierto, created_at, 'Ticket creado'
  FROM tickets WHERE status_id = @en_progreso;

  INSERT INTO ticket_history (ticket_id, old_status_id, new_status_id, changed_at, notes)
  SELECT id, @abierto, @en_progreso, DATEADD(HOUR, 2, created_at), 'Estado cambiado a En progreso'
  FROM tickets WHERE status_id = @en_progreso;

  -- Historial tickets Resueltos (creación + avance + resolución)
  INSERT INTO ticket_history (ticket_id, old_status_id, new_status_id, changed_at, notes)
  SELECT id, NULL, @abierto, created_at, 'Ticket creado'
  FROM tickets WHERE status_id = @resuelto;

  INSERT INTO ticket_history (ticket_id, old_status_id, new_status_id, changed_at, notes)
  SELECT id, @abierto, @en_progreso, DATEADD(HOUR, 1, created_at), 'Estado cambiado a En progreso'
  FROM tickets WHERE status_id = @resuelto;

  INSERT INTO ticket_history (ticket_id, old_status_id, new_status_id, changed_at, notes)
  SELECT id, @en_progreso, @resuelto, DATEADD(HOUR, 4, created_at), 'Estado cambiado a Resuelto'
  FROM tickets WHERE status_id = @resuelto;

  PRINT '✅ ticket_history: registros de historial insertados';
END
ELSE
  PRINT '⚠️  ticket_history: ya tiene datos, se omite';
GO

-- =====================================================
-- RESUMEN FINAL
-- =====================================================
SELECT 'priorities'    AS tabla, COUNT(*) AS registros FROM priorities    UNION ALL
SELECT 'statuses'      AS tabla, COUNT(*) AS registros FROM statuses       UNION ALL
SELECT 'agents'        AS tabla, COUNT(*) AS registros FROM agents         UNION ALL
SELECT 'clients'       AS tabla, COUNT(*) AS registros FROM clients        UNION ALL
SELECT 'tickets'       AS tabla, COUNT(*) AS registros FROM tickets        UNION ALL
SELECT 'ticket_history'AS tabla, COUNT(*) AS registros FROM ticket_history;
GO

-- RESUMEN POR ESTADO
SELECT
  s.name      AS estado,
  COUNT(t.id) AS total_tickets
FROM statuses s
LEFT JOIN tickets t ON t.status_id = s.id
GROUP BY s.id, s.name, s.display_order
ORDER BY s.display_order;
GO
