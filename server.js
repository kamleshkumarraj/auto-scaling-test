const express = require("express");
const axios = require("axios");
const os = require("os");
const path = require("path");

const app = express();
const PORT = 3000;

// View engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

let cpuBurning = false;
let networkFlooding = false;

/* ==========================
   CPU STRESS FUNCTION
========================== */
function burnCPU() {
  const end = Date.now() + 1000;
  while (Date.now() < end) {
    Math.sqrt(Math.random() * Math.random());
  }
  if (cpuBurning) setImmediate(burnCPU);
}

/* ==========================
   NETWORK STRESS FUNCTION
========================== */
async function floodNetwork() {
  try {
    await axios.get("https://speed.cloudflare.com/__down?bytes=50000000");
  } catch (e) {
    // ignore errors
  }
  if (networkFlooding) setImmediate(floodNetwork);
}

/* ==========================
   ROUTES
========================== */

app.get("/", (req, res) => {
  res.render("index", {
    hostname: os.hostname(),
    cpuCount: os.cpus().length
  });
});

app.post("/cpu/start", (req, res) => {
  if (!cpuBurning) {
    cpuBurning = true;
    for (let i = 0; i < os.cpus().length; i++) {
      burnCPU();
    }
  }
  res.json({ status: "CPU stress started" });
});

app.post("/cpu/stop", (req, res) => {
  cpuBurning = false;
  res.json({ status: "CPU stress stopped" });
});

app.post("/network/start", (req, res) => {
  if (!networkFlooding) {
    networkFlooding = true;
    floodNetwork();
  }
  res.json({ status: "Network flood started" });
});

app.post("/network/stop", (req, res) => {
  networkFlooding = false;
  res.json({ status: "Network flood stopped" });
});

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    uptime: process.uptime(),
    memory: process.memoryUsage().rss
  });
});

app.listen(PORT, () => {
  console.log(`🔥 ASG Stress App running on port ${PORT}`);
});
