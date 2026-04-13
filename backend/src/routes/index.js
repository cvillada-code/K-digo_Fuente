const router = require("express").Router();
const tickets = require("../controllers/ticketsController");
const catalog = require("../controllers/catalogController");

// Tickets
router.get("/tickets",              tickets.getAll);
router.get("/tickets/summary",      tickets.getSummary);
router.post("/tickets",             tickets.create);
router.patch("/tickets/:id/advance",tickets.advanceStatus);
router.delete("/tickets/:id",       tickets.remove);

// Catalogs
router.get("/agents",     catalog.getAgents);
router.get("/clients",    catalog.getClients);
router.get("/priorities", catalog.getPriorities);

module.exports = router;
