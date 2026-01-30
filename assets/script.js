// Map init
const map = L.map('map', { zoomControl: true }).setView([54.5, -98.5], 4); // North America center

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Cluster layer for performance
const cluster = L.markerClusterGroup({ disableClusteringAtZoom: 16, spiderfyOnMaxZoom: true });
map.addLayer(cluster);

const numericOnlyEl = document.getElementById('numericOnly');
const btnRefresh = document.getElementById('btnRefresh');

// Keyboard shortcut R to refresh
window.addEventListener('keydown', (e) => { if (e.key.toLowerCase() === 'r') fetchAndRender(); });
btnRefresh.addEventListener('click', fetchAndRender);

let inflightController = null;

function bboxToString(b) {
  const s = b.getSouth(), w = b.getWest(), n = b.getNorth(), e = b.getEast();
  return [s, w, n, e].join(',');
}

function buildQuery() {
  const bbox = bboxToString(map.getBounds());
  const numericFilter = numericOnlyEl.checked ? '["maxspeed"]' : '';
  // Match node where traffic_sign contains a 'maxspeed' token (allows semicolon lists and country-coded variants)
  const q = `[out:json][timeout:180];(
    node["traffic_sign"~"(^|;)maxspeed([;:]|$)"]${numericFilter}(${bbox});
  );out tags geom;`;
  return q;
}

function makeIcon(maxspeed) {
  if (maxspeed) {
    const txt = (maxspeed + '').split(';')[0];
    return L.divIcon({
      className: 'badge',
      html: `<span class="txt">${txt}</span>`,
      iconSize: [26, 26],
      iconAnchor: [13, 13]
    });
  }
  return L.divIcon({ className: 'pin', iconSize: [16, 16], iconAnchor: [8, 8] });
}

async function fetchAndRender() {
  if (map.getZoom() < 10) {
    alert('Please zoom to at least 10 before fetching (to avoid huge queries).');
    return;
  }

  // Abort previous
  if (inflightController) inflightController.abort();
  inflightController = new AbortController();

  const query = buildQuery();
  const url = 'https://overpass-api.de/api/interpreter';

  btnRefresh.disabled = true; btnRefresh.textContent = 'Loading…';
  try {
    const body = 'data=' + encodeURIComponent(query);
    const res = await fetch(url, {
      method: 'POST',
      body,
      signal: inflightController.signal,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
    });
    if (!res.ok) throw new Error('Overpass error ' + res.status);
    const data = await res.json();

    cluster.clearLayers();

    (data.elements || []).filter(el => el.type === 'node').forEach(el => {
      const ms = el.tags?.maxspeed;
      const latlng = [el.lat, el.lon];
      const marker = L.marker(latlng, { icon: makeIcon(ms) });

      const rows = Object.entries(el.tags || {})
        .map(([k, v]) => `<tr><td><code>${k}</code></td><td>${v}</td></tr>`).join('');
      const popup = `<div style="min-width:220px"><strong>Speed Sign</strong><br/>
        <table class="tags">${rows}</table>
        <div class="small">OSM node id: <a target="_blank" href="https://www.openstreetmap.org/node/${el.id}">${el.id}</a></div>
      </div>`;
      marker.bindPopup(popup);
      marker.bindTooltip(ms ? `${ms}` : 'maxspeed sign');
      cluster.addLayer(marker);
    });

  } catch (err) {
    if (err.name !== 'AbortError') {
      console.error(err);
      alert('Failed to load from Overpass. Try zooming in further or retry later.');
    }
  } finally {
    btnRefresh.disabled = false; btnRefresh.textContent = 'Refresh (R)';
    inflightController = null;
  }
}

// No auto-fetch on load to avoid heavy global queries
