// --- Service Worker Registration & Update Logic ---
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js')
        .then(reg => {
            reg.addEventListener('updatefound', () => {
                const newWorker = reg.installing;
                newWorker.addEventListener('statechange', () => {
                    // When the new worker is installed, show the update prompt
                    if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                        const updateNotification = document.getElementById('updateNotification');
                        updateNotification.classList.remove('hidden');

                        const updateBtn = document.getElementById('updateBtn');
                        updateBtn.addEventListener('click', () => {
                            newWorker.postMessage({ action: 'skipWaiting' });
                        });
                    }
                });
            });
        })
        .catch(error => console.log('Service Worker registration failed:', error));

    // This event fires when the new service worker has taken control
    navigator.serviceWorker.addEventListener('controllerchange', () => {
        // Reload the page to use the new assets
        window.location.reload();
    });
}


// --- Main App Logic ---
document.addEventListener('DOMContentLoaded', function() {
    
    // --- Element References ---
    const downloadBtn = document.getElementById('downloadBtn');
    const locationBtn = document.getElementById('locationBtn');
    const statusMsg = document.getElementById('statusMsg');
    const CACHE_NAME = 'hike-map-cache-v4'; // Match the new cache version

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
            map.locate({ watch: true, setView: true, maxZoom: 16 });
            locationBtn.textContent = 'Stop Tracking';
            statusMsg.textContent = 'Looking for your location...';
            isLocating = true;
        } else {
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
        const radius = e.accuracy / 2;

        if (!locationMarker) {
            locationMarker = L.circleMarker(e.latlng, {
                radius: 8, fillColor: "#1e90ff", color: "#fff",
                weight: 2, opacity: 1, fillOpacity: 0.7
            }).addTo(map).bindPopup(`You are within ${radius.toFixed(0)} meters of this point`).openPopup();
        } else {
            locationMarker.setLatLng(e.latlng);
        }
    });

    map.on('locationerror', (e) => {
        statusMsg.textContent = `Could not find location: ${e.message}`;
        isLocating = false;
        locationBtn.textContent = 'Show My Location';
    });


    // --- Process Hike Stages ---
    hikeStagesData.forEach((stage, index) => {
        fetch(stage.kml)
            .then(response => {
                if (!response.ok) throw new Error(`Network error for ${stage.kml}`);
                return response.text();
            })
            .then(kmlText => {
                const geojson = toGeoJSON.kml(new DOMParser().parseFromString(kmlText, 'text/xml'));
                
                let stageColor = '#3388ff';
                if (stage.difficulty === 'Easy') stageColor = '#00e600';
                else if (stage.difficulty === 'Difficult') stageColor = '#ff7800';
                else if (stage.difficulty === 'Very difficult') stageColor = '#e60000';

                const geoJsonLayer = L.geoJSON(geojson, {
                    style: () => ({ color: stageColor, weight: 4, opacity: 0.8 }),
                    onEachFeature: (feature, layer) => {
                        const popupContent = `
                            <h3>${stage.name}</h3>
                            <strong>Distance:</strong> ${stage.distance}<br>
                            <strong>Time:</strong> ${stage.time}<br>
                            <strong>Ascent:</strong> ${stage.ascent}<br>
                            <strong>Descent:</strong> ${stage.descent}<br>
                            <strong>Difficulty:</strong> ${stage.difficulty}<br>
                            <strong>Ground Type:</strong> ${stage.groundType}
                        `;
                        layer.bindPopup(popupContent);
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