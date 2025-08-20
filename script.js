// --- Service Worker Registration ---
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js')
            .then(registration => console.log('Service Worker registered:', registration))
            .catch(error => console.log('Service Worker registration failed:', error));
    });
}


// --- Main App Logic ---
document.addEventListener('DOMContentLoaded', function() {
    
    // --- Element References ---
    const downloadBtn = document.getElementById('downloadBtn');
    const locationBtn = document.getElementById('locationBtn');
    const statusMsg = document.getElementById('statusMsg');
    const CACHE_NAME = 'hike-map-cache-v3';

    // --- Download Button Logic ---
    downloadBtn.addEventListener('click', async () => {
        statusMsg.textContent = 'Downloading offline data...';
        try {
            const kmlUrls = hikeStagesData.map(stage => stage.kml);
            const appShellFiles = [
              '.', 'index.html', 'style.css', 'script.js', 'data.js',
              'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
              'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js',
              'https://cdnjs.cloudflare.com/ajax/libs/togeojson/0.16.0/togeojson.min.js'
            ];
            const urlsToCache = [...appShellFiles, ...kmlUrls];

            const cache = await caches.open(CACHE_NAME);
            await cache.addAll(urlsToCache);
            statusMsg.textContent = 'Offline data saved successfully!';
        } catch (error) {
            statusMsg.textContent = 'Failed to save offline data. Check console for errors.';
            console.error('Caching failed:', error);
        }
    });


    // --- Map Initialization ---
    const map = L.map('map').setView([46.378858, 13.848988], 10);
    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri'
    }).addTo(map);

    const hikeLayers = L.featureGroup().addTo(map);
    const hutLayers = L.featureGroup().addTo(map);

    
    // --- Live Location Logic ---
    let isLocating = false;
    let locationMarker = null;

    locationBtn.addEventListener('click', () => {
        if (!isLocating) {
            // Start locating
            map.locate({ watch: true, setView: true, maxZoom: 16 });
            locationBtn.textContent = 'Stop Tracking';
            statusMsg.textContent = 'Looking for your location...';
            isLocating = true;
        } else {
            // Stop locating
            map.stopLocate();
            if (locationMarker) {
                map.removeLayer(locationMarker);
                locationMarker = null;
            }
            locationBtn.textContent = 'Show My Location';
            statusMsg.textContent = 'Location tracking stopped.';
            isLocating = false;
        }
    });

    map.on('locationfound', (e) => {
        statusMsg.textContent = 'Location found!';
        if (!locationMarker) {
            // Create the marker if it doesn't exist
            locationMarker = L.marker(e.latlng).addTo(map)
                .bindPopup("You are here.").openPopup();
        } else {
            // Just update the position if it already exists
            locationMarker.setLatLng(e.latlng);
        }
    });

    map.on('locationerror', (e) => {
        statusMsg.textContent = `Could not find location: ${e.message}`;
        isLocating = false;
        locationBtn.textContent = 'Show My Location';
    });


    // --- Process Hike Stages ---
    const colors = ['#ff7800', '#3388ff', '#00e600', '#e60000', '#800080', '#ff00ff', '#ffff00', '#00ffff'];
    hikeStagesData.forEach((stage, index) => {
        fetch(stage.kml)
            .then(response => {
                if (!response.ok) throw new Error(`Network error for ${stage.kml}`);
                return response.text();
            })
            .then(kmlText => {
                const geojson = toGeoJSON.kml(new DOMParser().parseFromString(kmlText, 'text/xml'));
                const stageColor = colors[index % colors.length];
                const geoJsonLayer = L.geoJSON(geojson, {
                    style: () => ({ color: stageColor, weight: 4, opacity: 0.8 }),
                    onEachFeature: (feature, layer) => {
                        layer.bindPopup(`<h3>${stage.name}</h3>... (details)`); // Abridged for brevity
                    }
                });
                hikeLayers.addLayer(geoJsonLayer);
                if (hikeLayers.getLayers().length > 0 && !isLocating) {
                     map.fitBounds(hikeLayers.getBounds().pad(0.1));
                }
            })
            .catch(error => console.error('Error loading KML:', error));
    });

    // --- Process Huts ---
    const hutIcon = L.icon({
        iconUrl: 'data:image/svg+xml;base64,' + btoa('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="brown" width="36px" height="36px"><path d="M0 0h24v24H0z" fill="none"/><path d="M12 5.5l6 4.5v9H6v-9l6-4.5M12 3L4 9v12h16V9l-8-6z"/></svg>'),
        iconSize: [30, 30], iconAnchor: [15, 30], popupAnchor: [0, -30]
    });
    hutsData.forEach(hut => {
        L.marker([hut.lat, hut.lon], { icon: hutIcon })
            .addTo(hutLayers)
            .bindPopup(`<h4>${hut.name}</h4><strong>Altitude:</strong> ${hut.alt} m`);
    });

    // --- Layer Control ---
    L.control.layers({"Satellite": satelliteLayer}, {"Hike Stages": hikeLayers, "Huts": hutLayers}).addTo(map);
});
