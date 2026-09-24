
const dataMap = {
  in: { origin: "India (AS55836)", rule: "Rule #1 (India)", target: "https://example.in/product", pop: "BOM-1 (Mumbai)", latency: "22ms" },
  us: { origin: "United States (AS7922)", rule: "Rule #2 (North America)", target: "https://example.com/us", pop: "IAD-2 (Virginia)", latency: "16ms" },
  gb: { origin: "United Kingdom (AS2856)", rule: "Rule #3 (UK)", target: "https://example.co.uk", pop: "LHR-1 (London)", latency: "19ms" },
  de: { origin: "Germany (AS3320)", rule: "Default Fallback", target: "https://example.com", pop: "FRA-4 (Frankfurt)", latency: "25ms" },
  br: { origin: "Brazil (AS27699)", rule: "Default Fallback", target: "https://example.com", pop: "GRU-1 (São Paulo)", latency: "34ms" }
};

function updateSimulation() {
  const val = document.getElementById('sim-location').value;
  const item = dataMap[val] || dataMap.in;
  const statusEl = document.getElementById('sim-status');
  statusEl.textContent = "RESOLVING...";
  statusEl.className = "text-primary-container animate-pulse";
  setTimeout(() => {
    document.getElementById('sim-origin').textContent = item.origin;
    document.getElementById('sim-rule').textContent = item.rule;
    document.getElementById('sim-target').textContent = item.target;
    document.getElementById('sim-pop').textContent = item.pop;
    document.getElementById('sim-latency').textContent = item.latency;
    statusEl.textContent = "MATCH_FOUND";
    statusEl.className = "text-tertiary-fixed-dim";
  }, 200);
}

document.getElementById('run-sim-btn').addEventListener('click', updateSimulation);
document.getElementById('sim-location').addEventListener('change', updateSimulation);
