
const COUNTRIES = ['IN','US','GB','DE','FR','JP','AU','BR','CA','SG','AE','IT','ES','NL','RU','CN','KR','MX','ID','ZA'];

function addGeoRule() {
  const container = document.getElementById('geo-rules-container');
  const row = document.createElement('div');
  row.className = 'flex items-center gap-2 geo-rule-row';
  row.innerHTML = `
    <select class="geo-country bg-surface-container-lowest border border-outline-variant/40 rounded-lg px-2 py-2 text-xs text-on-surface font-mono outline-none">
      <option value="">Select country</option>
      ${COUNTRIES.map(c => `<option value="${c}">${c}</option>`).join('')}
    </select>
    <span class="material-symbols-outlined text-outline text-sm">arrow_forward</span>
    <input type="url" class="geo-dest flex-1 bg-surface-container-lowest border border-outline-variant/40 rounded-lg px-2 py-2 text-xs text-on-surface font-mono outline-none placeholder:text-outline" placeholder="https://example.in"/>
    <button onclick="this.parentElement.remove()" class="text-error hover:text-red-300 shrink-0">
      <span class="material-symbols-outlined text-base">close</span>
    </button>
  `;
  container.appendChild(row);
}

async function handleShorten() {
  const longUrl = document.getElementById('long-url').value.trim();
  const errEl = document.getElementById('shorten-error');
  const resEl = document.getElementById('shorten-result');
  errEl.classList.add('hidden');
  resEl.classList.add('hidden');

  if (!longUrl) {
    errEl.textContent = 'Please enter a URL';
    errEl.classList.remove('hidden');
    return;
  }

  const geoRules = {};
  document.querySelectorAll('.geo-rule-row').forEach(row => {
    const country = row.querySelector('.geo-country').value;
    const dest = row.querySelector('.geo-dest').value.trim();
    if (country && dest) geoRules[country] = dest;
  });

  try {
    const data = await shortenUrl(longUrl, geoRules);
    if (data.error) {
      errEl.textContent = data.error;
      errEl.classList.remove('hidden');
      return;
    }
    document.getElementById('short-url').textContent = data.shortUrl;
    document.getElementById('short-url').href = data.shortUrl;
    document.getElementById('analytics-code').value = data.code;
    resEl.classList.remove('hidden');
    loadOverviewStats();
  } catch (e) {
    errEl.textContent = 'Error: ' + e.message;
    errEl.classList.remove('hidden');
  }
}

function copyShortUrl() {
  const url = document.getElementById('short-url').textContent;
  navigator.clipboard.writeText(url);
  event.target.closest('button').innerHTML = '<span class="material-symbols-outlined text-base text-tertiary">check</span>';
  setTimeout(() => {
    event.target.closest('button').innerHTML = '<span class="material-symbols-outlined text-base">content_copy</span>';
  }, 1500);
}

async function handleAnalytics() {
  const code = document.getElementById('analytics-code').value.trim();
  const errEl = document.getElementById('analytics-error');
  const resEl = document.getElementById('analytics-result');
  errEl.classList.add('hidden');
  resEl.classList.add('hidden');

  if (!code) {
    errEl.textContent = 'Enter a short code';
    errEl.classList.remove('hidden');
    return;
  }

  try {
    const data = await getAnalytics(code);
    if (data.error) {
      errEl.textContent = data.error;
      errEl.classList.remove('hidden');
      return;
    }
    document.getElementById('an-total').textContent = data.total;
    document.getElementById('an-countries').textContent = data.countries.length;

    const list = document.getElementById('an-list');
    if (data.countries.length === 0) {
      list.innerHTML = '<div class="text-center py-4 text-outline text-xs">No clicks yet</div>';
    } else {
      const max = Math.max(...data.countries.map(c => parseInt(c.count)), 1);
      list.innerHTML = data.countries.map(c => `
        <div class="bg-surface-container-lowest rounded-lg p-2">
          <div class="flex items-center justify-between text-xs mb-1">
            <span class="font-mono text-on-surface font-medium">${c.country}</span>
            <span class="text-outline">${c.count} clicks</span>
          </div>
          <div class="w-full bg-surface-container-highest h-1 rounded-full overflow-hidden">
            <div class="bg-primary-container h-full" style="width: ${(parseInt(c.count)/max)*100}%"></div>
          </div>
        </div>
      `).join('');
    }
    resEl.classList.remove('hidden');
  } catch (e) {
    errEl.textContent = 'Error: ' + e.message;
    errEl.classList.remove('hidden');
  }
}

async function loadOverviewStats() {
  // Placeholder — backend me /stats endpoint nahi hai abhi
  // Hardcoded 0 rakhenge, backend me add karenge baad me
}

loadOverviewStats();
