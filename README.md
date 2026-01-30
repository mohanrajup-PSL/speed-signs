# North America Speed‑Limit Signboards (OSM)

This is a static, client‑side web app that displays **speed‑limit signboards** from OpenStreetMap (nodes tagged `traffic_sign=maxspeed`) across **North America**, using the **Overpass API**.

## How it works
- Pan/zoom the map and click **Refresh** (or press **R**). The app runs an Overpass query for the **current map view** and displays markers.
- **Numeric only** toggle restricts results to nodes where the number on the sign is tagged on the node (`maxspeed=*`).

## Deploy on GitHub Pages
1. Create a new repository (e.g., `speed-signs`) and upload these files to the repo root.
2. In your repo: **Settings → Pages** → **Build and deployment** → Source: `Deploy from a branch` → Branch: `main` → Folder: `/root` → **Save**.
3. Your site will publish at `https://<your-username>.github.io/<repo-name>/` (e.g., `https://mohanrajup-PSL.github.io/speed-signs/`).

## Local development
Open `index.html` with a local HTTP server (for CORS):
```bash
# Python 3
python -m http.server 8080
