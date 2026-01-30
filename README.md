[README-speed-limit-tool.md](https://github.com/user-attachments/files/24970928/README-speed-limit-tool.md)

# OpenStreetBrowser – Speed Limit Finder (Shareable)

This single-file tool lets anyone paste an **address** or **lat,lon** and open **OpenStreetBrowser** at `zoom=16` so they can enable **Transportation → Individual traffic → Maxspeed** to view speed‑limit sign icons. It also queries **Overpass** to find the **nearest mapped speed‑limit sign** around the point and displays its **latitude/longitude**.

## Files
- `openstreetbrowser-speed-limit-finder-v2.html` — the tool (no build step; open directly in a browser)

## Quick test (local)
Double-click the HTML file to open it in your default browser. Paste `12.9737,77.6092` and click **Open in OpenStreetBrowser**.

## Publish for a public team link

### Option A — GitHub Pages (recommended)
1. Create a new public repo (e.g., `osb-speed-limit-tool`).
2. Upload `openstreetbrowser-speed-limit-finder-v2.html` to the repo root.
3. In **Settings → Pages**, set **Branch** = `main` (or `master`) and **/ (root)`**; save.
4. After a minute or two, your site will be available at `https://<your-username>.github.io/osb-speed-limit-tool/`.
5. Share links like:
   - `https://<your-username>.github.io/osb-speed-limit-tool/openstreetbrowser-speed-limit-finder-v2.html?lat=12.973700&lon=77.609200&auto=1`

### Option B — SharePoint/OneDrive (works if custom script allowed)
1. Upload the HTML file to a document library (e.g., **Site Assets**).
2. Share a **view** link to the file. If script is blocked by policy, use GitHub Pages instead.

## How share links work
- The page consumes `lat`, `lon`, optional `q`, and `auto=1`. Example:
  `.../openstreetbrowser-speed-limit-finder-v2.html?lat=12.973700&lon=77.609200&q=MG%20Road%20Bengaluru&auto=1`
- When opened, it auto-opens **OpenStreetBrowser** at `?lat=…&lon=…&zoom=16` and requests the nearest speed sign via Overpass.

## Notes
- Sign visibility in OpenStreetBrowser’s **Maxspeed** category starts at **zoom 16**.
- The Overpass lookup searches for nodes with `traffic_sign~"maxspeed"` or nodes with `maxspeed=*` within ~120 m. If nothing is found, the page still opens at the requested point.

## Customize
- To change the default radius, open the HTML file and edit `findNearestSpeedSign(lat, lon, radius=120)`.
- To prefill a default location for your team, share a link with `lat`, `lon`, and `auto=1`.

---
