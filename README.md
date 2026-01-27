# Speed Limit Signboard Finder (static site)

A single-page site with **one search box** (address *or* `lat, lon`) that returns the **nearest speed‑limit signboard** via official DOT **open ArcGIS FeatureServer** layers.

**Datasets wired in now**
- **Maryland DOT SHA — Roadway Posted Speed Limit Signs** (point locations; MUTCD, legend, route, etc.).  
  Dataset page: https://data-maryland.opendata.arcgis.com/datasets/maryland::mdot-sha-roadway-posted-speed-limit-signs/explore  
  FeatureServer layer: `https://services.arcgis.com/njFNhDsUCentVYJW/arcgis/rest/services/MDOT_SHA_Roadway_Posted_Speed_Limit_Signs/FeatureServer/0`
- **Utah DOT (UDOT) — Speed Limit Signs** (point locations from LiDAR inventory; sign faces/assemblies).  
  Hub page: https://hub.arcgis.com/datasets/uplan::speed-limit-signs-2/about  
  FeatureServer layer (example): `https://services.arcgis.com/99lidPhWCzftIe9K/ArcGIS/rest/services/Speed_Limit_Signs/FeatureServer/0`

**West Virginia DOT**: WV publishes a statewide Speed Limit Signs dataset with ~30k points on its Open Data portal.  
Portal page: https://data-wvdot.opendata.arcgis.com/datasets/18c827e7b6a443d29996691c1012589e_0/explore  
> Add WV by pasting its **FeatureServer/0** URL into the `SOURCES` array in `index.html` (see the commented block).

## How to host

### Option A — Azure Static Web Apps (recommended)
1. Create a new **GitHub repo** and put this folder's contents at repo root. Commit.
2. In Azure Portal → *Create resource* → **Static Web App**. Link your GitHub repo & main branch.  
   - **Build presets**: *Custom*  
   - **App location**: `/`  
   - **Output location**: `/`  
3. After deployment finishes, Azure creates a GitHub Action. Your app is live at `https://<random>.azurestaticapps.net/` (you can add a custom domain).

### Option B — Azure Storage Static Website
```bash
# Requires Azure CLI logged in: az login
RESOURCE_GROUP=rg-signfinder
LOC=eastus
STG=stsignfinder$RANDOM
az group create -n $RESOURCE_GROUP -l $LOC
az storage account create -n $STG -g $RESOURCE_GROUP -l $LOC --sku Standard_LRS
az storage blob service-properties update --account-name $STG --static-website --index-document index.html
az storage blob upload --account-name $STG -c '$web' -f index.html -n index.html --overwrite
az storage account show -n $STG -g $RESOURCE_GROUP --query "primaryEndpoints.web"
```

### Option C — GitHub Pages (quickest)
1. Create a **public** repo, upload `index.html` at root.  
2. Repo → **Settings** → **Pages** → *Deploy from branch*, select `main` and `/ (root)`.  
3. The site appears at `https://<your-user>.github.io/<repo>/`.

## Usage
- Enter an **address** *or* a **lat, lon** pair (e.g., `39.021, -79.814`).
- The page geocodes addresses (Nominatim) or parses the coordinates directly, then queries the connected DOT layers and shows the **nearest signboard** with details.

## Add more states
Append new entries to the `SOURCES` array with `{ name, layerUrl, detailsUrl, props }`. For ArcGIS Hub/Open Data items, click **API** on the dataset page to copy the **FeatureServer/0** URL.

## Notes
- For production or higher volume, replace Nominatim with a paid/enterprise geocoder (e.g., ArcGIS World Geocoding Service) and add your API key.
- If a FeatureServer throttles heavy anonymous use, consider using an API key (if permitted) or run through your own ArcGIS proxy with proper credentials.
- The app requests GeoJSON directly via `/query?f=geojson` and computes true nearest by **haversine**.
