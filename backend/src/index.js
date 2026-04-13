const express = require("express");
const cors = require("cors");
const { initDB } = require("./db");
const routes = require("./routes");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use("/api", routes);

app.get("/health", (req, res) => res.json({ status: "ok" }));

async function start() {
  let retries = 10;
  while (retries > 0) {
    try {
      await initDB();
      break;
    } catch (err) {
      retries--;
      console.log(`⏳ Waiting for DB... (${retries} retries left)`);
      console.error(`   ❌ Error: ${err.message}`);
      await new Promise((r) => setTimeout(r, 5000));
    }
  }

  app.listen(PORT, () => {
    console.log(`🚀 Backend running on http://localhost:${PORT}`);
  });
}

start();
