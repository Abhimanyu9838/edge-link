
let allLinks = [];

async function loadLinks() {
  const tbody = document.getElementById('links-tbody');
  try {
    // Note: backend me /links endpoint nahi hai abhi — isliye mock data dikha rahe hain
    // Baad me backend me add karenge
    const mock = [
      { code: '1UjDNo', long_url: 'https://github.com', created_at: new Date().toISOString(), clicks: 12, geo: true },
      { code: '1UjDIM', long_url: 'https://google.com', created_at: new Date(Date.now() - 86400000).toISOString(), clicks: 45, geo: true },
      { code: '1UjDFY', long_url: 'https://github.com', created_at: new Date(Date.now() - 172800000).toISOString(), clicks: 8, geo: false },
      { code: '1UjDF0', long_url: 'https://github.com', created_at: new Date(Date.now() - 259200000).toISOString(), clicks: 3, geo: false }
    ];
    allLinks = mock;
    renderLinks(mock);
  } catch (e) {
    tbody.innerHTML = `<tr><td colspan="6" class="py-8 text-center text-error">Error: ${e.message}</td></tr>`;
  }
}

function renderLinks(links) {
  const tbody = document.getElementById('links-tbody');
  document.getElementById('links-count').textContent = links.length;
  document.getElementById('showing-count').textContent = links.length;

  if (links.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" class="py-12 text-center text-outline">
      <span class="material-symbols-outlined text-4xl mb-2 block">link_off</span>
      No links found
    </td></tr>`;
    return;
  }

  tbody.innerHTML = links.map(l => {
    const shortUrl = `${window.location.origin}/${l.code}`;
    const created = new Date(l.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    return `
      <tr class="hover:bg-surface-container/50 transition border-t border-outline-variant/10">
        <td class="py-3 px-5">
          <div class="flex items-center gap-2">
            <span class="font-mono text-primary font-medium">/${l.code}</span>
            ${l.geo ? '<span class="text-[10px] px-1.5 py-0.5 rounded bg-surface-container-high text-primary-fixed font-mono">GEO</span>' : ''}
          </div>
        </td>
        <td class="py-3 px-5 max-w-xs">
          <div class="flex items-center gap-1 text-on-surface-variant truncate font-mono text-xs">
            <span class="material-symbols-outlined text-xs text-outline">arrow_outward</span>
            <span class="truncate">${l.long_url}</span>
          </div>
        </td>
        <td class="py-3 px-5 text-right font-mono font-bold text-on-surface">${l.clicks}</td>
        <td class="py-3 px-5 font-mono text-xs text-on-surface-variant">${created}</td>
        <td class="py-3 px-5">
          <span class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-surface-container text-tertiary text-xs">
            <span class="w-1.5 h-1.5 rounded-full bg-tertiary-container animate-pulse"></span>
            Active
          </span>
        </td>
        <td class="py-3 px-5 text-right">
          <div class="flex items-center justify-end gap-1">
            <button onclick="copyLink('${shortUrl}')" class="p-1 hover:text-primary-container hover:bg-surface-container rounded transition" title="Copy">
              <span class="material-symbols-outlined text-base">content_copy</span>
            </button>
            <a href="${shortUrl}" target="_blank" class="p-1 hover:text-primary-container hover:bg-surface-container rounded transition" title="Open">
              <span class="material-symbols-outlined text-base">open_in_new</span>
            </a>
            <button onclick="viewAnalytics('${l.code}')" class="p-1 hover:text-primary-container hover:bg-surface-container rounded transition" title="Analytics">
              <span class="material-symbols-outlined text-base">monitoring</span>
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

function copyLink(url) {
  navigator.clipboard.writeText(url);
  event.target.closest('button').innerHTML = '<span class="material-symbols-outlined text-base text-tertiary">check</span>';
  setTimeout(() => {
    event.target.closest('button').innerHTML = '<span class="material-symbols-outlined text-base">content_copy</span>';
  }, 1500);
}

function viewAnalytics(code) {
  window.location.href = `index.html?code=${code}`;
}

document.getElementById('table-search').addEventListener('input', (e) => {
  const q = e.target.value.toLowerCase();
  renderLinks(allLinks.filter(l => l.code.toLowerCase().includes(q) || l.long_url.toLowerCase().includes(q)));
});

loadLinks();
