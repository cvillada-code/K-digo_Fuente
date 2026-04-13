USE [SupportTickets]
GO
/****** Object:  Table [dbo].[agents]    Script Date: 12/04/2026 5:39:26 p. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[agents](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[name] [nvarchar](100) NOT NULL,
	[email] [nvarchar](150) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[clients]    Script Date: 12/04/2026 5:39:26 p. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[clients](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[name] [nvarchar](100) NOT NULL,
	[email] [nvarchar](150) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[priorities]    Script Date: 12/04/2026 5:39:26 p. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[priorities](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[name] [nvarchar](50) NOT NULL,
	[level] [int] NOT NULL,
	[color] [nvarchar](20) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[statuses]    Script Date: 12/04/2026 5:39:26 p. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[statuses](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[name] [nvarchar](50) NOT NULL,
	[display_order] [int] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[ticket_history]    Script Date: 12/04/2026 5:39:26 p. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ticket_history](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[ticket_id] [int] NOT NULL,
	[old_status_id] [int] NULL,
	[new_status_id] [int] NOT NULL,
	[changed_at] [datetime] NULL,
	[notes] [nvarchar](500) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[tickets]    Script Date: 12/04/2026 5:39:26 p. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[tickets](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[title] [nvarchar](200) NOT NULL,
	[description] [nvarchar](max) NULL,
	[client_id] [int] NOT NULL,
	[priority_id] [int] NOT NULL,
	[status_id] [int] NOT NULL,
	[agent_id] [int] NULL,
	[created_at] [datetime] NULL,
	[updated_at] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
SET IDENTITY_INSERT [dbo].[agents] ON 

INSERT [dbo].[agents] ([id], [name], [email]) VALUES (1, N'Ana García', N'ana.garcia@soporte.com')
INSERT [dbo].[agents] ([id], [name], [email]) VALUES (2, N'Carlos López', N'carlos.lopez@soporte.com')
INSERT [dbo].[agents] ([id], [name], [email]) VALUES (3, N'María Torres', N'maria.torres@soporte.com')
INSERT [dbo].[agents] ([id], [name], [email]) VALUES (4, N'Luis Ramírez', N'luis.ramirez@soporte.com')
INSERT [dbo].[agents] ([id], [name], [email]) VALUES (5, N'Sofía Mendoza', N'sofia.mendoza@soporte.com')
INSERT [dbo].[agents] ([id], [name], [email]) VALUES (6, N'Andrés Castillo', N'andres.castillo@soporte.com')
INSERT [dbo].[agents] ([id], [name], [email]) VALUES (7, N'Carlos Villada', N'carlosvillada@hotmail.com')
SET IDENTITY_INSERT [dbo].[agents] OFF
GO
SET IDENTITY_INSERT [dbo].[clients] ON 

INSERT [dbo].[clients] ([id], [name], [email]) VALUES (2, N'Empresa ABC S.A.S', N'contacto@abc.com')
INSERT [dbo].[clients] ([id], [name], [email]) VALUES (3, N'Corporación XYZ Ltda', N'soporte@xyz.com')
INSERT [dbo].[clients] ([id], [name], [email]) VALUES (4, N'Grupo Industrial 123', N'info@grupo123.com')
INSERT [dbo].[clients] ([id], [name], [email]) VALUES (5, N'Startup Delta Tech', N'hola@delta.io')
INSERT [dbo].[clients] ([id], [name], [email]) VALUES (6, N'Distribuidora El Norte', N'sistemas@elnorte.com')
INSERT [dbo].[clients] ([id], [name], [email]) VALUES (7, N'Constructora Bolivar', N'ti@bolivar.com')
INSERT [dbo].[clients] ([id], [name], [email]) VALUES (8, N'Clínica Santa María', N'soporte@santamaria.com.co')
INSERT [dbo].[clients] ([id], [name], [email]) VALUES (9, N'Colegio San Ignacio', N'admin@sanignacio.edu.co')
INSERT [dbo].[clients] ([id], [name], [email]) VALUES (10, N'Copy and Paste S.A.S', N'contacto@copyandpaste.com')
SET IDENTITY_INSERT [dbo].[clients] OFF
GO
SET IDENTITY_INSERT [dbo].[priorities] ON 

INSERT [dbo].[priorities] ([id], [name], [level], [color]) VALUES (1, N'Crítico', 1, N'#ef4444')
INSERT [dbo].[priorities] ([id], [name], [level], [color]) VALUES (2, N'Alto', 2, N'#f97316')
INSERT [dbo].[priorities] ([id], [name], [level], [color]) VALUES (3, N'Medio', 3, N'#eab308')
INSERT [dbo].[priorities] ([id], [name], [level], [color]) VALUES (4, N'Bajo', 4, N'#22c55e')
SET IDENTITY_INSERT [dbo].[priorities] OFF
GO
SET IDENTITY_INSERT [dbo].[statuses] ON 

INSERT [dbo].[statuses] ([id], [name], [display_order]) VALUES (1, N'Abierto', 1)
INSERT [dbo].[statuses] ([id], [name], [display_order]) VALUES (2, N'En progreso', 2)
INSERT [dbo].[statuses] ([id], [name], [display_order]) VALUES (3, N'Resuelto', 3)
SET IDENTITY_INSERT [dbo].[statuses] OFF
GO
SET IDENTITY_INSERT [dbo].[ticket_history] ON 

INSERT [dbo].[ticket_history] ([id], [ticket_id], [old_status_id], [new_status_id], [changed_at], [notes]) VALUES (1, 4, NULL, 1, CAST(N'2026-04-11T12:28:42.647' AS DateTime), N'Ticket creado')
INSERT [dbo].[ticket_history] ([id], [ticket_id], [old_status_id], [new_status_id], [changed_at], [notes]) VALUES (2, 5, NULL, 1, CAST(N'2026-04-11T10:28:42.647' AS DateTime), N'Ticket creado')
INSERT [dbo].[ticket_history] ([id], [ticket_id], [old_status_id], [new_status_id], [changed_at], [notes]) VALUES (3, 6, NULL, 1, CAST(N'2026-04-10T15:28:42.647' AS DateTime), N'Ticket creado')
INSERT [dbo].[ticket_history] ([id], [ticket_id], [old_status_id], [new_status_id], [changed_at], [notes]) VALUES (4, 7, NULL, 1, CAST(N'2026-04-10T15:28:42.647' AS DateTime), N'Ticket creado')
INSERT [dbo].[ticket_history] ([id], [ticket_id], [old_status_id], [new_status_id], [changed_at], [notes]) VALUES (5, 8, NULL, 1, CAST(N'2026-04-11T07:28:42.647' AS DateTime), N'Ticket creado')
INSERT [dbo].[ticket_history] ([id], [ticket_id], [old_status_id], [new_status_id], [changed_at], [notes]) VALUES (6, 9, NULL, 1, CAST(N'2026-04-09T15:28:42.647' AS DateTime), N'Ticket creado')
INSERT [dbo].[ticket_history] ([id], [ticket_id], [old_status_id], [new_status_id], [changed_at], [notes]) VALUES (7, 10, NULL, 1, CAST(N'2026-04-09T15:28:42.647' AS DateTime), N'Ticket creado')
INSERT [dbo].[ticket_history] ([id], [ticket_id], [old_status_id], [new_status_id], [changed_at], [notes]) VALUES (8, 11, NULL, 1, CAST(N'2026-04-08T15:28:42.647' AS DateTime), N'Ticket creado')
INSERT [dbo].[ticket_history] ([id], [ticket_id], [old_status_id], [new_status_id], [changed_at], [notes]) VALUES (9, 12, NULL, 1, CAST(N'2026-04-07T15:28:42.647' AS DateTime), N'Ticket creado')
INSERT [dbo].[ticket_history] ([id], [ticket_id], [old_status_id], [new_status_id], [changed_at], [notes]) VALUES (10, 13, NULL, 1, CAST(N'2026-04-08T15:28:42.647' AS DateTime), N'Ticket creado')
INSERT [dbo].[ticket_history] ([id], [ticket_id], [old_status_id], [new_status_id], [changed_at], [notes]) VALUES (11, 9, 1, 2, CAST(N'2026-04-09T17:28:42.647' AS DateTime), N'Estado cambiado a En progreso')
INSERT [dbo].[ticket_history] ([id], [ticket_id], [old_status_id], [new_status_id], [changed_at], [notes]) VALUES (12, 10, 1, 2, CAST(N'2026-04-09T17:28:42.647' AS DateTime), N'Estado cambiado a En progreso')
INSERT [dbo].[ticket_history] ([id], [ticket_id], [old_status_id], [new_status_id], [changed_at], [notes]) VALUES (13, 11, 1, 2, CAST(N'2026-04-08T17:28:42.647' AS DateTime), N'Estado cambiado a En progreso')
INSERT [dbo].[ticket_history] ([id], [ticket_id], [old_status_id], [new_status_id], [changed_at], [notes]) VALUES (14, 12, 1, 2, CAST(N'2026-04-07T17:28:42.647' AS DateTime), N'Estado cambiado a En progreso')
INSERT [dbo].[ticket_history] ([id], [ticket_id], [old_status_id], [new_status_id], [changed_at], [notes]) VALUES (15, 13, 1, 2, CAST(N'2026-04-08T17:28:42.647' AS DateTime), N'Estado cambiado a En progreso')
INSERT [dbo].[ticket_history] ([id], [ticket_id], [old_status_id], [new_status_id], [changed_at], [notes]) VALUES (16, 14, NULL, 1, CAST(N'2026-04-06T15:28:42.647' AS DateTime), N'Ticket creado')
INSERT [dbo].[ticket_history] ([id], [ticket_id], [old_status_id], [new_status_id], [changed_at], [notes]) VALUES (17, 15, NULL, 1, CAST(N'2026-04-05T15:28:42.647' AS DateTime), N'Ticket creado')
INSERT [dbo].[ticket_history] ([id], [ticket_id], [old_status_id], [new_status_id], [changed_at], [notes]) VALUES (18, 16, NULL, 1, CAST(N'2026-04-04T15:28:42.647' AS DateTime), N'Ticket creado')
INSERT [dbo].[ticket_history] ([id], [ticket_id], [old_status_id], [new_status_id], [changed_at], [notes]) VALUES (19, 17, NULL, 1, CAST(N'2026-04-03T15:28:42.647' AS DateTime), N'Ticket creado')
INSERT [dbo].[ticket_history] ([id], [ticket_id], [old_status_id], [new_status_id], [changed_at], [notes]) VALUES (20, 18, NULL, 1, CAST(N'2026-04-01T15:28:42.647' AS DateTime), N'Ticket creado')
INSERT [dbo].[ticket_history] ([id], [ticket_id], [old_status_id], [new_status_id], [changed_at], [notes]) VALUES (21, 14, 1, 2, CAST(N'2026-04-06T16:28:42.647' AS DateTime), N'Estado cambiado a En progreso')
INSERT [dbo].[ticket_history] ([id], [ticket_id], [old_status_id], [new_status_id], [changed_at], [notes]) VALUES (22, 15, 1, 2, CAST(N'2026-04-05T16:28:42.647' AS DateTime), N'Estado cambiado a En progreso')
INSERT [dbo].[ticket_history] ([id], [ticket_id], [old_status_id], [new_status_id], [changed_at], [notes]) VALUES (23, 16, 1, 2, CAST(N'2026-04-04T16:28:42.647' AS DateTime), N'Estado cambiado a En progreso')
INSERT [dbo].[ticket_history] ([id], [ticket_id], [old_status_id], [new_status_id], [changed_at], [notes]) VALUES (24, 17, 1, 2, CAST(N'2026-04-03T16:28:42.647' AS DateTime), N'Estado cambiado a En progreso')
INSERT [dbo].[ticket_history] ([id], [ticket_id], [old_status_id], [new_status_id], [changed_at], [notes]) VALUES (25, 18, 1, 2, CAST(N'2026-04-01T16:28:42.647' AS DateTime), N'Estado cambiado a En progreso')
INSERT [dbo].[ticket_history] ([id], [ticket_id], [old_status_id], [new_status_id], [changed_at], [notes]) VALUES (26, 14, 2, 3, CAST(N'2026-04-06T19:28:42.647' AS DateTime), N'Estado cambiado a Resuelto')
INSERT [dbo].[ticket_history] ([id], [ticket_id], [old_status_id], [new_status_id], [changed_at], [notes]) VALUES (27, 15, 2, 3, CAST(N'2026-04-05T19:28:42.647' AS DateTime), N'Estado cambiado a Resuelto')
INSERT [dbo].[ticket_history] ([id], [ticket_id], [old_status_id], [new_status_id], [changed_at], [notes]) VALUES (28, 16, 2, 3, CAST(N'2026-04-04T19:28:42.647' AS DateTime), N'Estado cambiado a Resuelto')
INSERT [dbo].[ticket_history] ([id], [ticket_id], [old_status_id], [new_status_id], [changed_at], [notes]) VALUES (29, 17, 2, 3, CAST(N'2026-04-03T19:28:42.647' AS DateTime), N'Estado cambiado a Resuelto')
INSERT [dbo].[ticket_history] ([id], [ticket_id], [old_status_id], [new_status_id], [changed_at], [notes]) VALUES (30, 18, 2, 3, CAST(N'2026-04-01T19:28:42.647' AS DateTime), N'Estado cambiado a Resuelto')
INSERT [dbo].[ticket_history] ([id], [ticket_id], [old_status_id], [new_status_id], [changed_at], [notes]) VALUES (31, 11, 2, 3, CAST(N'2026-04-12T14:59:03.047' AS DateTime), N'Estado cambiado a Resuelto')
INSERT [dbo].[ticket_history] ([id], [ticket_id], [old_status_id], [new_status_id], [changed_at], [notes]) VALUES (32, 19, NULL, 1, CAST(N'2026-04-12T15:34:52.973' AS DateTime), N'Ticket creado')
INSERT [dbo].[ticket_history] ([id], [ticket_id], [old_status_id], [new_status_id], [changed_at], [notes]) VALUES (33, 20, NULL, 1, CAST(N'2026-04-12T16:40:04.953' AS DateTime), N'Ticket creado')
INSERT [dbo].[ticket_history] ([id], [ticket_id], [old_status_id], [new_status_id], [changed_at], [notes]) VALUES (34, 4, 1, 2, CAST(N'2026-04-12T17:02:41.933' AS DateTime), N'Estado cambiado a En progreso')
SET IDENTITY_INSERT [dbo].[ticket_history] OFF
GO
SET IDENTITY_INSERT [dbo].[tickets] ON 

INSERT [dbo].[tickets] ([id], [title], [description], [client_id], [priority_id], [status_id], [agent_id], [created_at], [updated_at]) VALUES (4, N'Servidor de correo no responde', N'Desde esta mañana los usuarios no pueden enviar ni recibir correos. Afecta a toda la empresa.', 2, 1, 2, 1, CAST(N'2026-04-11T12:28:42.647' AS DateTime), CAST(N'2026-04-12T17:02:41.927' AS DateTime))
INSERT [dbo].[tickets] ([id], [title], [description], [client_id], [priority_id], [status_id], [agent_id], [created_at], [updated_at]) VALUES (5, N'Error al generar facturas en el sistema', N'El módulo de facturación arroja error 500 al intentar guardar. Impide operación del día.', 3, 1, 1, 2, CAST(N'2026-04-11T10:28:42.647' AS DateTime), CAST(N'2026-04-11T15:28:42.647' AS DateTime))
INSERT [dbo].[tickets] ([id], [title], [description], [client_id], [priority_id], [status_id], [agent_id], [created_at], [updated_at]) VALUES (6, N'Impresora de red sin conexión', N'La impresora del piso 3 no aparece en la red. Varios usuarios afectados.', 4, 3, 1, 3, CAST(N'2026-04-10T15:28:42.647' AS DateTime), CAST(N'2026-04-11T15:28:42.647' AS DateTime))
INSERT [dbo].[tickets] ([id], [title], [description], [client_id], [priority_id], [status_id], [agent_id], [created_at], [updated_at]) VALUES (7, N'Solicitud de nuevo usuario en el ERP', N'Se requiere crear acceso para la nueva contadora. Usuario: mlopez@empresa.com', 5, 4, 1, NULL, CAST(N'2026-04-10T15:28:42.647' AS DateTime), CAST(N'2026-04-11T15:28:42.647' AS DateTime))
INSERT [dbo].[tickets] ([id], [title], [description], [client_id], [priority_id], [status_id], [agent_id], [created_at], [updated_at]) VALUES (8, N'Pantalla azul en equipo de gerencia', N'El equipo del gerente general presenta BSOD al iniciar. Código: IRQL_NOT_LESS_OR_EQUAL', 6, 2, 1, 4, CAST(N'2026-04-11T07:28:42.647' AS DateTime), CAST(N'2026-04-11T15:28:42.647' AS DateTime))
INSERT [dbo].[tickets] ([id], [title], [description], [client_id], [priority_id], [status_id], [agent_id], [created_at], [updated_at]) VALUES (9, N'Base de datos lenta en horas pico', N'Entre las 10am y 12pm el sistema se torna muy lento. Se sospecha de consultas sin índice.', 7, 2, 2, 1, CAST(N'2026-04-09T15:28:42.647' AS DateTime), CAST(N'2026-04-11T15:28:42.647' AS DateTime))
INSERT [dbo].[tickets] ([id], [title], [description], [client_id], [priority_id], [status_id], [agent_id], [created_at], [updated_at]) VALUES (10, N'VPN no conecta desde trabajo remoto', N'Tres usuarios remotos no logran establecer conexión VPN desde ayer. Error: timeout.', 8, 2, 2, 5, CAST(N'2026-04-09T15:28:42.647' AS DateTime), CAST(N'2026-04-11T15:28:42.647' AS DateTime))
INSERT [dbo].[tickets] ([id], [title], [description], [client_id], [priority_id], [status_id], [agent_id], [created_at], [updated_at]) VALUES (11, N'Actualización de antivirus pendiente', N'Se requiere actualizar el antivirus en 15 equipos del área administrativa.', 9, 3, 3, 6, CAST(N'2026-04-08T15:28:42.647' AS DateTime), CAST(N'2026-04-12T14:59:03.040' AS DateTime))
INSERT [dbo].[tickets] ([id], [title], [description], [client_id], [priority_id], [status_id], [agent_id], [created_at], [updated_at]) VALUES (12, N'Migración de archivos al servidor nuevo', N'Mover 200GB de documentos del servidor viejo al nuevo NAS instalado la semana pasada.', 2, 3, 2, 2, CAST(N'2026-04-07T15:28:42.647' AS DateTime), CAST(N'2026-04-11T15:28:42.647' AS DateTime))
INSERT [dbo].[tickets] ([id], [title], [description], [client_id], [priority_id], [status_id], [agent_id], [created_at], [updated_at]) VALUES (13, N'Configurar backup automático', N'Programar tarea de respaldo diario a las 2am para la base de datos de producción.', 3, 2, 2, 3, CAST(N'2026-04-08T15:28:42.647' AS DateTime), CAST(N'2026-04-11T15:28:42.647' AS DateTime))
INSERT [dbo].[tickets] ([id], [title], [description], [client_id], [priority_id], [status_id], [agent_id], [created_at], [updated_at]) VALUES (14, N'Cambio de contraseña de usuario bloqueado', N'Usuario jperez bloqueado por intentos fallidos. Se requería desbloqueo urgente.', 4, 4, 3, 4, CAST(N'2026-04-06T15:28:42.647' AS DateTime), CAST(N'2026-04-11T15:28:42.647' AS DateTime))
INSERT [dbo].[tickets] ([id], [title], [description], [client_id], [priority_id], [status_id], [agent_id], [created_at], [updated_at]) VALUES (15, N'Instalación de Office en equipo nuevo', N'Equipo nuevo del área de marketing sin suite ofimática instalada.', 5, 4, 3, 5, CAST(N'2026-04-05T15:28:42.647' AS DateTime), CAST(N'2026-04-11T15:28:42.647' AS DateTime))
INSERT [dbo].[tickets] ([id], [title], [description], [client_id], [priority_id], [status_id], [agent_id], [created_at], [updated_at]) VALUES (16, N'Falla en el switch del piso 2', N'Switch principal del piso 2 sin energía. Se reemplazó por unidad de repuesto.', 6, 1, 3, 1, CAST(N'2026-04-04T15:28:42.647' AS DateTime), CAST(N'2026-04-11T15:28:42.647' AS DateTime))
INSERT [dbo].[tickets] ([id], [title], [description], [client_id], [priority_id], [status_id], [agent_id], [created_at], [updated_at]) VALUES (17, N'Recuperación de archivo eliminado', N'Usuario eliminó accidentalmente carpeta de proyectos. Se recuperó desde backup.', 7, 2, 3, 6, CAST(N'2026-04-03T15:28:42.647' AS DateTime), CAST(N'2026-04-11T15:28:42.647' AS DateTime))
INSERT [dbo].[tickets] ([id], [title], [description], [client_id], [priority_id], [status_id], [agent_id], [created_at], [updated_at]) VALUES (18, N'Configuración de correo en celular', N'Gerente comercial no podía recibir correos en su iPhone. Problema de configuración IMAP.', 8, 4, 3, 2, CAST(N'2026-04-01T15:28:42.647' AS DateTime), CAST(N'2026-04-11T15:28:42.647' AS DateTime))
INSERT [dbo].[tickets] ([id], [title], [description], [client_id], [priority_id], [status_id], [agent_id], [created_at], [updated_at]) VALUES (19, N'De la oficina Colteger, no tiene conexión a Internet', N'Desde las 8:00 horas no tienen conexión a ningún sitio desde el browser.', 8, 2, 1, 1, CAST(N'2026-04-12T15:34:52.967' AS DateTime), CAST(N'2026-04-12T15:34:52.967' AS DateTime))
INSERT [dbo].[tickets] ([id], [title], [description], [client_id], [priority_id], [status_id], [agent_id], [created_at], [updated_at]) VALUES (20, N'No hay internet', N'El usuario va ingresar a cualquier sitio en internet. Y no funciona.', 10, 2, 1, 7, CAST(N'2026-04-12T16:40:04.947' AS DateTime), CAST(N'2026-04-12T16:40:04.947' AS DateTime))
SET IDENTITY_INSERT [dbo].[tickets] OFF
GO
ALTER TABLE [dbo].[ticket_history] ADD  DEFAULT (getdate()) FOR [changed_at]
GO
ALTER TABLE [dbo].[tickets] ADD  DEFAULT (getdate()) FOR [created_at]
GO
ALTER TABLE [dbo].[tickets] ADD  DEFAULT (getdate()) FOR [updated_at]
GO
ALTER TABLE [dbo].[ticket_history]  WITH CHECK ADD FOREIGN KEY([new_status_id])
REFERENCES [dbo].[statuses] ([id])
GO
ALTER TABLE [dbo].[ticket_history]  WITH CHECK ADD FOREIGN KEY([old_status_id])
REFERENCES [dbo].[statuses] ([id])
GO
ALTER TABLE [dbo].[ticket_history]  WITH CHECK ADD FOREIGN KEY([ticket_id])
REFERENCES [dbo].[tickets] ([id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[tickets]  WITH CHECK ADD FOREIGN KEY([agent_id])
REFERENCES [dbo].[agents] ([id])
GO
ALTER TABLE [dbo].[tickets]  WITH CHECK ADD FOREIGN KEY([client_id])
REFERENCES [dbo].[clients] ([id])
GO
ALTER TABLE [dbo].[tickets]  WITH CHECK ADD FOREIGN KEY([priority_id])
REFERENCES [dbo].[priorities] ([id])
GO
ALTER TABLE [dbo].[tickets]  WITH CHECK ADD FOREIGN KEY([status_id])
REFERENCES [dbo].[statuses] ([id])
GO
