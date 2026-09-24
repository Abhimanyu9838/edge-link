
const COUNTRIES_POOL = [
  { code: 'IN', flag: '🇮🇳', name: 'India', pop: 'BOM-1', lat: '36ms' },
  { code: 'US', flag: '🇺🇸', name: 'United States', pop: 'IAD-1', lat: '19ms' },
  { code: 'GB', flag: '🇬🇧', name: 'United Kingdom', pop: 'LHR-1', lat: '24ms' },
  { code: 'DE', flag: '🇩🇪', name: 'Germany', pop: 'FRA-1', lat: '29ms' },
  { code: 'SG', flag: '🇸🇬', name: 'Singapore', pop: 'SIN-1', lat: '31ms' },
  { code: 'JP', flag: '🇯🇵', name: 'Japan', pop: 'NRT-1', lat: '33ms' },
  { code: 'AU', flag: '🇦🇺', name: 'Australia', pop: 'SYD-1', lat: '40ms' },
  { code: 'BR', flag: '🇧🇷', name: 'Brazil', pop: 'GRU-1', lat: '44ms' }
];

const CODES_POOL = ['1UjDNo', '1UjDIM', '1UjDFY', '1UjDF0', 'launch', 'summer-sale', 'docs', 'product'];

let isPaused = false;
let eventCount = 0;
let intervalId = null;

function makeEvent() {
  const country = COUNTRIES_POOL[Math.floor(Math.random() * COUNTRIES_POOL.length)];
  const code = CODES_POOL[Math.floor(Math.random() * CODES_POOL.length)];
  const now = new Date();
  const ts = now.toTimeString().split(' ')[0];
  const statuses = ['302 Edge', '301 Cache', '307 Temp', '308 Perm'];
  const status = statuses[Math.floor(Math.random() * statuses.length)];
  return { ts, country, code, status };
}

function renderEvent(evt) {
  const tbody = document.getElementById('stream-body');
  const row = document.createElement('tr');
  row.className = 'border-t border-outline-variant/10 hover:bg-surface-container-high/60 transition-colors';
  row.innerHTML = `
    <td class="py-2 px-4 text-on-surface-variant whitespace-nowrap">${evt.ts}</td>
    <td class="py-2 px-4 text-on-surface whitespace-nowrap">${evt.country.flag} ${evt.country.name}</td>
    <td class="py-2 px-4 text-primary whitespace-nowrap font-medium">edge.link/${evt.code}</td>
    <td class="py-2 px-4 text-on-surface whitespace-nowrap"><span class="text-tertiary">→</span> ${evt.country.pop}</td>
    <td class="py-2 px-4 text-tertiary whitespace-nowrap font-bold">${evt.country.lat}</td>
    <td class="py-2 px-4 whitespace-nowrap"><span class="bg-surface-container-lowest px-1.5 py-0.5 rounded text-outline">${evt.status}</span></td>
  `;
  tbody.insertBefore(row, tbody.firstChild);

  // Keep only last 50
  while (tbody.children.length > 50) {
    tbody.removeChild(tbody.lastChild);
  }

  eventCount++;
  document.getElementById('buffer-count').textContent = eventCount;
}

function startStream() {
  intervalId = setInterval(() => {
    if (!isPaused) renderEvent(makeEvent());
  }, 1200);
}

document.getElementById('pause-btn').addEventListener('click', () => {
  isPaused = !isPaused;
  document.getElementById('pause-icon').textContent = isPaused ? 'play_arrow' : 'pause';
  document.getElementById('pause-label').textContent = isPaused ? 'Resume' : 'Pause';
});

document.getElementById('clear-btn').addEventListener('click', () => {
  document.getElementById('stream-body').innerHTML = '';
  eventCount = 0;
  document.getElementById('buffer-count').textContent = '0';
});

// Seed initial events
for (let i = 0; i < 6; i++) renderEvent(makeEvent());
startStream();
