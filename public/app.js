async function startCPU() {
  await fetch("/cpu/start", { method: "POST" });
  updateStatus("🔥 CPU stress running");
}

async function stopCPU() {
  await fetch("/cpu/stop", { method: "POST" });
  updateStatus("✅ CPU stress stopped");
}

async function startNetwork() {
  await fetch("/network/start", { method: "POST" });
  updateStatus("🌐 Network outbound flooding");
}

async function stopNetwork() {
  await fetch("/network/stop", { method: "POST" });
  updateStatus("🛑 Network traffic stopped");
}

function updateStatus(text) {
  document.getElementById("status").innerText = "Status: " + text;
}
