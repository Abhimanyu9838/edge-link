// API base — local me same origin
const API_BASE = window.location.origin;

async function shortenUrl(longUrl, geoRules) {
  const body = { longUrl };
  if (geoRules && Object.keys(geoRules).length > 0) body.geoRules = geoRules;
  const r = await fetch(`${API_BASE}/shorten`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  return r.json();
}

async function resolveCode(code, country) {
  const url = country
    ? `${API_BASE}/resolve/${code}?country=${country}`
    : `${API_BASE}/resolve/${code}`;
  const r = await fetch(url);
  return r.json();
}

async function getAnalytics(code) {
  const r = await fetch(`${API_BASE}/analytics/${code}`);
  return r.json();
}

function formatNumber(n) {
  return new Intl.NumberFormat('en-US').format(n);
}
